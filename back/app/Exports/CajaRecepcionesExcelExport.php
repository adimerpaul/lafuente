<?php

namespace App\Exports;

use App\Models\CajaRecepcion;
use App\Models\Costo;
use Illuminate\Support\Collection;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CajaRecepcionesExcelExport
{
    private const BG_BRAND = '12395B';
    private const BG_TITLE = 'DCEBFA';
    private const BG_META = 'F8FAFC';
    private const BG_BASE = '1F4E79';
    private const BG_PAYMENT = '0F766E';
    private const BG_COSTS = '6D4C41';
    private const BG_TOTAL = 'DBEAFE';
    private const BG_ALT = 'F7FBFF';
    private const BG_DANGER = 'FEE2E2';
    private const BORDER = 'CBD5E1';
    private const WHITE = 'FFFFFF';
    private const TEXT = '0F172A';
    private const MUTED = '64748B';
    private const BG_HEADER_DOCTOR = 'FFC7CE';
    private const FG_HEADER_DOCTOR = '9C0006';
    private const BG_HEADER_PAGOS = 'C4BD97';
    private const BG_RESUMEN_DIST = 'E8BF55';

    // Colores por costo segun el formato entregado por la clinica.
    private const COST_COLORS = [
        'ATENCION MEDICA' => ['F4B8AD', '0F172A'],
        'ATENCION EMERGENCIA' => ['F4B8AD', '0F172A'],
        'PROCEDIMIENTO MEDICO' => ['CCC0DA', '0F172A'],
        'LABORATORIO' => ['EAB308', '0F172A'],
        'ECOGRAFIA' => ['C4BD97', '0F172A'],
        'TOMOGRAFIA' => ['92CDDC', '0F172A'],
        'FISIOTERAPIA' => ['31859C', 'FFFFFF'],
        'ODONTOLOGIA' => ['8DB4E2', '0F172A'],
        'ENFERMERIA' => ['C4BD97', '0F172A'],
        'INSUMOS' => ['D99694', '0F172A'],
        'CONSULTORIO' => ['FCD5B4', '0F172A'],
        'FARMACIA' => ['C6EFCE', '006100'],
        'AMBULANCIA' => ['FCD5B4', '0F172A'],
    ];
    private const COST_FALLBACK_COLORS = ['FDE68A', 'A7F3D0', 'C7D2FE', 'FBCFE8', 'FED7AA', 'BAE6FD'];

    private const LEGACY_COSTS = [
        'Atencion medica' => 'costo_atencion_medica',
        'Curacion' => 'costo_curacion',
        'Inyectable' => 'costo_inyectable',
        'Toma de presion' => 'costo_toma_presion',
        'Ambulancia' => 'costo_ambulancia',
        'Laboratorio' => 'costo_laboratorio',
        'Ecografia' => 'costo_ecografia',
        'Uso consultorio' => 'costo_uso_consultorio',
        'Glicemia' => 'costo_glicemia',
        'Certificado medico' => 'costo_certificado_medico',
        'Sutura' => 'costo_sutura',
        'Antisepticos' => 'costo_antisepticos',
        'Cama' => 'costo_cama',
        'Compania noche' => 'costo_compania_noche',
        'Uso ecografia' => 'costo_uso_ecografia',
        'Flebotomia' => 'costo_flebotomia',
        'Sonda' => 'costo_sonda',
        'Farmacia' => 'costo_farmacia',
        'Otros costos' => 'otros_costos',
    ];

    public function __construct(
        private readonly Collection $items,
        private readonly array $summary,
        private readonly array $filters,
        private readonly string $userLabel,
        private readonly string $fileName,
    ) {}

    public function download(): StreamedResponse
    {
        $spreadsheet = $this->build();

        return new StreamedResponse(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="' . rawurlencode($this->fileName) . '.xlsx"',
            'Cache-Control' => 'max-age=0',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }

    private function build(): Spreadsheet
    {
        $spreadsheet = new Spreadsheet();
        $spreadsheet->getProperties()
            ->setCreator('Clinica La Fuente')
            ->setTitle('Reporte profesional de caja recepcion')
            ->setSubject('Ingresos de caja y costos por recepcion');

        $costColumns = $this->costColumns();
        $this->buildDetalleSheet($spreadsheet, $costColumns);
        $this->buildResumenSheet($spreadsheet, $costColumns);
        $spreadsheet->setActiveSheetIndex(0);

        return $spreadsheet;
    }

    private function buildDetalleSheet(Spreadsheet $spreadsheet, array $costColumns): void
    {
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Caja recepcion');

        $baseHeaders = [
            '#', 'Fecha', 'Hora', 'Estado', 'Cobro', 'Paciente', 'Ficha', 'Encargado',
            'Medico / Servicio', 'Documento', 'N Factura', 'Atencion', 'QR', 'Efectivo', 'Egreso', 'Recaudado',
        ];
        $costSpecs = $this->costColumnSpecs($costColumns, count($baseHeaders) + 1);
        $costHeaders = [];
        foreach ($costSpecs as $spec) {
            array_push($costHeaders, ...$spec['headers']);
        }
        $headers = array_merge($baseHeaders, $costHeaders);
        $lastCol = Coordinate::stringFromColumnIndex(count($headers));

        $this->writeTitle($sheet, $lastCol);
        $this->writeKpis($sheet, $lastCol);

        $groupRow = 9;
        $headerRow = 10;
        $this->writeGroupHeader($sheet, 'A', 'L', $groupRow, 'DATOS DE CAJA', self::BG_BASE);
        $this->writeGroupHeader($sheet, 'M', 'P', $groupRow, 'PAGOS Y CIERRE', self::BG_PAYMENT);

        foreach ($costSpecs as $spec) {
            $start = Coordinate::stringFromColumnIndex($spec['start']);
            $end = Coordinate::stringFromColumnIndex($spec['start'] + count($spec['headers']) - 1);
            $this->writeGroupHeader($sheet, $start, $end, $groupRow, mb_strtoupper($spec['name']), $spec['bg'], $spec['fg']);
        }

        foreach ($headers as $index => $label) {
            $col = Coordinate::stringFromColumnIndex($index + 1);
            $sheet->setCellValue("{$col}{$headerRow}", $label);
        }
        $sheet->getStyle("A{$headerRow}:{$lastCol}{$headerRow}")->applyFromArray([
            'font' => ['bold' => true, 'size' => 8, 'color' => ['argb' => 'FF' . self::TEXT]],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FFF1F5F9']],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                'textRotation' => 90,
                'wrapText' => true,
            ],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FF' . self::BORDER]]],
        ]);
        $sheet->getStyle("I{$headerRow}")->applyFromArray([
            'font' => ['bold' => true, 'size' => 8, 'color' => ['argb' => 'FF' . self::FG_HEADER_DOCTOR]],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF' . self::BG_HEADER_DOCTOR]],
        ]);
        $sheet->getStyle("M{$headerRow}:P{$headerRow}")->applyFromArray([
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF' . self::BG_HEADER_PAGOS]],
        ]);
        $sheet->getRowDimension($headerRow)->setRowHeight(86);

        $dataRow = 11;
        foreach ($this->items as $index => $item) {
            $rowValues = array_merge([
                $index + 1,
                (string) ($item->fecha ?? ''),
                (string) ($item->hora ?? ''),
                (string) ($item->estado_label ?? $item->estado ?? 'Activo'),
                (string) ($item->estado_cobro ?? 'Pendiente'),
                trim((string) (optional($item->paciente)->nombre_completo ?: $item->nombre_factura ?: '')),
                (string) ($item->numero_ficha ?? ''),
                (string) optional($item->user)->name,
                trim((string) (optional($item->doctor)->nombre ?: $item->laboratorio_nombre ?: $item->medico_ecografia ?: '')),
                (string) ($item->documento_label ?? ''),
                (string) ($item->nombre_factura ?? ''),
                (string) ($item->tipo_atencion ?? ''),
                (float) ($item->qr ?? 0),
                (float) ($item->efectivo ?? 0),
                (float) ($item->egreso ?? 0),
                (float) ($item->qr ?? 0) + (float) ($item->efectivo ?? 0) - (float) ($item->egreso ?? 0),
            ], $this->costRowCells($item, $costSpecs));

            foreach ($rowValues as $colIndex => $value) {
                $col = Coordinate::stringFromColumnIndex($colIndex + 1);
                $sheet->setCellValue("{$col}{$dataRow}", $value);
            }

            $bg = ($item->is_anulado ?? false) ? self::BG_DANGER : (($index % 2 === 1) ? self::BG_ALT : 'FFFFFF');
            $sheet->getStyle("A{$dataRow}:{$lastCol}{$dataRow}")->applyFromArray([
                'font' => ['size' => 8, 'color' => ['argb' => 'FF' . self::TEXT]],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF' . $bg]],
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
                'borders' => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FF' . self::BORDER]]],
            ]);
            $sheet->getStyle("A{$dataRow}:E{$dataRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("M{$dataRow}:{$lastCol}{$dataRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
            $sheet->getStyle("M{$dataRow}:{$lastCol}{$dataRow}")->getNumberFormat()->setFormatCode('#,##0.00');
            $sheet->getRowDimension($dataRow)->setRowHeight(18);
            $dataRow++;
        }

        $this->writeTotalsRow($sheet, $dataRow, $headers);
        $this->applyDetalleWidths($sheet, count($headers));

        $sheet->freezePane('A11');
        $sheet->setAutoFilter("A{$headerRow}:{$lastCol}{$headerRow}");
        $sheet->getPageSetup()
            ->setOrientation(PageSetup::ORIENTATION_LANDSCAPE)
            ->setPaperSize(PageSetup::PAPERSIZE_A4)
            ->setFitToWidth(1)
            ->setFitToHeight(0);
        $sheet->getHeaderFooter()
            ->setOddHeader('&C&BReporte de Caja Recepcion')
            ->setOddFooter('&LClinica La Fuente&C&P / &N&RGenerado: ' . now()->format('d/m/Y H:i'));
    }

    private function buildResumenSheet(Spreadsheet $spreadsheet, array $costColumns): void
    {
        $sheet = $spreadsheet->createSheet();
        $sheet->setTitle('Resumen');
        $sheet->mergeCells('A1:H1');
        $sheet->setCellValue('A1', 'CLINICA LA FUENTE - RESUMEN DE CAJA RECEPCION');
        $sheet->getStyle('A1:H1')->applyFromArray([
            'font' => ['bold' => true, 'size' => 14, 'color' => ['argb' => 'FF' . self::WHITE]],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF' . self::BG_BRAND]],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ]);
        $sheet->getRowDimension(1)->setRowHeight(28);

        $meta = $this->metaText();
        $sheet->mergeCells('A2:H2');
        $sheet->setCellValue('A2', $meta);
        $sheet->getStyle('A2:H2')->applyFromArray([
            'font' => ['italic' => true, 'size' => 9, 'color' => ['argb' => 'FF' . self::MUTED]],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF' . self::BG_META]],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ]);

        $kpis = [
            ['QR', $this->summary['total_qr'] ?? 0, '0891B2'],
            ['Efectivo cobrado', $this->summary['total_efectivo'] ?? 0, '16A34A'],
            ['Egresos', $this->summary['total_egresos'] ?? 0, 'DC2626'],
            ['Final caja', $this->summary['total_final'] ?? 0, '4F46E5'],
        ];
        foreach ($kpis as $index => [$label, $value, $color]) {
            $col = Coordinate::stringFromColumnIndex(($index * 2) + 1);
            $next = Coordinate::stringFromColumnIndex(($index * 2) + 2);
            $sheet->mergeCells("{$col}4:{$next}4");
            $sheet->mergeCells("{$col}5:{$next}5");
            $sheet->setCellValue("{$col}4", $label);
            $sheet->setCellValue("{$col}5", (float) $value);
            $sheet->getStyle("{$col}4:{$next}5")->applyFromArray([
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF' . $color]],
                'font' => ['bold' => true, 'color' => ['argb' => 'FF' . self::WHITE]],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
                'borders' => ['outline' => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['argb' => 'FFFFFFFF']]],
            ]);
            $sheet->getStyle("{$col}5")->getNumberFormat()->setFormatCode('#,##0.00');
        }

        $headerRow = 8;
        $sheet->setCellValue("A{$headerRow}", 'Costo');
        $sheet->setCellValue("B{$headerRow}", 'Total Bs');
        $sheet->getStyle("A{$headerRow}:B{$headerRow}")->applyFromArray($this->tableHeaderStyle(self::BG_COSTS));

        $sheet->setCellValue("D{$headerRow}", 'Distribucion');
        $sheet->setCellValue("E{$headerRow}", 'CLI Bs');
        $sheet->setCellValue("F{$headerRow}", 'Tercero Bs');
        $sheet->setCellValue("G{$headerRow}", 'Total Bs');
        $sheet->getStyle("D{$headerRow}:G{$headerRow}")->applyFromArray($this->tableHeaderStyle(self::BG_RESUMEN_DIST, self::TEXT));

        $totales = [];
        foreach ($costColumns as $costName) {
            $total = 0.0;
            $doctor = 0.0;
            $clinica = 0.0;
            foreach ($this->paidItems() as $item) {
                $detail = $this->itemCostDetails($item)[$costName] ?? null;
                if (!$detail) {
                    continue;
                }
                $monto = (float) $detail['monto'];
                $cli = round($monto * ((float) $detail['porcentaje']) / 100, 2);
                $total += $monto;
                $clinica += $cli;
                $doctor += $monto - $cli;
            }
            $totales[$costName] = [
                'total' => round($total, 2),
                'clinica' => round($clinica, 2),
                'doctor' => round($doctor, 2),
                'tieneTercero' => round(100 - $this->costPorcentaje($costName), 2) > 0,
            ];
        }

        $leftRow = $headerRow + 1;
        foreach ($totales as $costName => $data) {
            if ($data['total'] <= 0) {
                continue;
            }
            $sheet->setCellValue("A{$leftRow}", $costName);
            $sheet->setCellValue("B{$leftRow}", $data['total']);
            $sheet->getStyle("A{$leftRow}:B{$leftRow}")->applyFromArray($this->bodyRowStyle($leftRow));
            $sheet->getStyle("B{$leftRow}")->getNumberFormat()->setFormatCode('#,##0.00');
            $leftRow++;
        }

        $rightRow = $headerRow + 1;
        foreach ($totales as $costName => $data) {
            if (!$data['tieneTercero']) {
                continue;
            }
            $sheet->setCellValue("D{$rightRow}", $costName);
            $sheet->setCellValue("E{$rightRow}", $data['clinica']);
            $sheet->setCellValue("F{$rightRow}", $data['doctor']);
            $sheet->setCellValue("G{$rightRow}", $data['total']);
            $sheet->getStyle("D{$rightRow}:G{$rightRow}")->applyFromArray($this->bodyRowStyle($rightRow));
            $sheet->getStyle("E{$rightRow}:G{$rightRow}")->getNumberFormat()->setFormatCode('#,##0.00');
            $rightRow++;
        }

        foreach (range('A', 'H') as $col) {
            $sheet->getColumnDimension($col)->setWidth(in_array($col, ['A', 'D']) ? 28 : 16);
        }
    }

    private function writeTitle($sheet, string $lastCol): void
    {
        $sheet->mergeCells("A1:{$lastCol}1");
        $sheet->setCellValue('A1', 'CLINICA LA FUENTE');
        $sheet->getStyle("A1:{$lastCol}1")->applyFromArray([
            'font' => ['bold' => true, 'size' => 16, 'color' => ['argb' => 'FF' . self::WHITE]],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF' . self::BG_BRAND]],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);
        $sheet->getRowDimension(1)->setRowHeight(30);

        $sheet->mergeCells("A2:{$lastCol}2");
        $sheet->setCellValue('A2', 'REPORTE PROFESIONAL DE CAJA RECEPCION');
        $sheet->getStyle("A2:{$lastCol}2")->applyFromArray([
            'font' => ['bold' => true, 'size' => 11, 'color' => ['argb' => 'FF' . self::BG_BRAND]],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF' . self::BG_TITLE]],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ]);

        $sheet->mergeCells("A3:{$lastCol}3");
        $sheet->setCellValue('A3', $this->metaText());
        $sheet->getStyle("A3:{$lastCol}3")->applyFromArray([
            'font' => ['italic' => true, 'size' => 8, 'color' => ['argb' => 'FF' . self::MUTED]],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF' . self::BG_META]],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ]);
    }

    private function writeKpis($sheet, string $lastCol): void
    {
        $labels = [
            ['Recaudado', $this->summary['total_recaudado'] ?? 0, self::BG_BASE],
            ['QR', $this->summary['total_qr'] ?? 0, '0891B2'],
            ['Efectivo', $this->summary['total_efectivo'] ?? 0, '16A34A'],
            ['Egresos', $this->summary['total_egresos'] ?? 0, 'DC2626'],
            ['Farmacia', $this->summary['total_farmacia'] ?? 0, 'EA580C'],
            ['Final caja', $this->summary['total_final'] ?? 0, '4F46E5'],
        ];

        $startCol = 1;
        foreach ($labels as [$label, $value, $color]) {
            $start = Coordinate::stringFromColumnIndex($startCol);
            $end = Coordinate::stringFromColumnIndex($startCol + 1);
            $sheet->mergeCells("{$start}5:{$end}5");
            $sheet->mergeCells("{$start}6:{$end}6");
            $sheet->setCellValue("{$start}5", $label);
            $sheet->setCellValue("{$start}6", (float) $value);
            $sheet->getStyle("{$start}5:{$end}6")->applyFromArray([
                'font' => ['bold' => true, 'color' => ['argb' => 'FF' . self::WHITE]],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF' . $color]],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
                'borders' => ['outline' => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['argb' => 'FFFFFFFF']]],
            ]);
            $sheet->getStyle("{$start}6")->getNumberFormat()->setFormatCode('#,##0.00');
            $startCol += 2;
        }
        $sheet->getRowDimension(4)->setRowHeight(5);
        $sheet->getRowDimension(5)->setRowHeight(18);
        $sheet->getRowDimension(6)->setRowHeight(22);
        $sheet->getRowDimension(7)->setRowHeight(5);
    }

    private function writeGroupHeader($sheet, string $start, string $end, int $row, string $title, string $bg, string $fg = self::WHITE): void
    {
        $sheet->mergeCells("{$start}{$row}:{$end}{$row}");
        $sheet->setCellValue("{$start}{$row}", $title);
        $sheet->getStyle("{$start}{$row}:{$end}{$row}")->applyFromArray([
            'font' => ['bold' => true, 'size' => 10, 'color' => ['argb' => 'FF' . $fg]],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF' . $bg]],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FF' . self::BORDER]]],
        ]);
        $sheet->getRowDimension($row)->setRowHeight(22);
    }

    private function writeTotalsRow($sheet, int $row, array $headers): void
    {
        $lastCol = Coordinate::stringFromColumnIndex(count($headers));
        $sheet->mergeCells("A{$row}:L{$row}");
        $sheet->setCellValue("A{$row}", 'TOTAL GENERAL (solo Pagado)');

        $start = 11;
        $end = max($start, $row - 1);
        $cobroCol = 'E';

        for ($colIndex = 13; $colIndex <= count($headers); $colIndex++) {
            $col = Coordinate::stringFromColumnIndex($colIndex);
            $sheet->setCellValue("{$col}{$row}", "=SUMIF({$cobroCol}{$start}:{$cobroCol}{$end},\"Pagado\",{$col}{$start}:{$col}{$end})");
        }

        $sheet->getStyle("A{$row}:{$lastCol}{$row}")->applyFromArray([
            'font' => ['bold' => true, 'size' => 9, 'color' => ['argb' => 'FF' . self::TEXT]],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF' . self::BG_TOTAL]],
            'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
            'borders' => [
                'top' => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['argb' => 'FF' . self::BG_BRAND]],
                'bottom' => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['argb' => 'FF' . self::BG_BRAND]],
            ],
        ]);
        $sheet->getStyle("A{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getStyle("M{$row}:{$lastCol}{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getStyle("M{$row}:{$lastCol}{$row}")->getNumberFormat()->setFormatCode('#,##0.00');
        $sheet->getRowDimension($row)->setRowHeight(22);
    }

    private function applyDetalleWidths($sheet, int $headerCount): void
    {
        $widths = [5, 11, 8, 10, 11, 28, 16, 20, 20, 12, 14, 16, 12, 12, 12, 13];
        foreach ($widths as $index => $width) {
            $sheet->getColumnDimension(Coordinate::stringFromColumnIndex($index + 1))->setWidth($width);
        }
        for ($i = count($widths) + 1; $i <= $headerCount; $i++) {
            $sheet->getColumnDimension(Coordinate::stringFromColumnIndex($i))->setWidth(13);
        }
    }

    private function paidItems(): Collection
    {
        return $this->items->filter(fn ($item) => ($item->estado_cobro ?? 'Pendiente') === 'Pagado');
    }

    private ?array $costCatalog = null;

    private function costCatalog(): array
    {
        if ($this->costCatalog === null) {
            $this->costCatalog = [];
            foreach (Costo::query()->where('activo', true)->orderBy('orden')->orderBy('nombre')->get() as $costo) {
                $name = trim((string) $costo->nombre);
                if ($name !== '' && !array_key_exists($name, $this->costCatalog)) {
                    $this->costCatalog[$name] = $costo->porcentaje !== null ? (float) $costo->porcentaje : 100.0;
                }
            }
        }

        return $this->costCatalog;
    }

    private function costPorcentaje(string $name): float
    {
        return $this->costCatalog()[$name] ?? 100.0;
    }

    private function pctLabel(float $value): string
    {
        return rtrim(rtrim(number_format($value, 2, '.', ''), '0'), '.') . '%';
    }

    private function costColumns(): array
    {
        $columns = array_keys($this->costCatalog());
        $extra = [];
        foreach ($this->items as $item) {
            foreach ($this->itemCostDetails($item) as $name => $detail) {
                if ((float) $detail['monto'] > 0 && !in_array($name, $columns, true) && !in_array($name, $extra, true)) {
                    $extra[] = $name;
                }
            }
        }

        sort($extra, SORT_NATURAL | SORT_FLAG_CASE);
        return array_merge($columns, $extra);
    }

    private function itemCostDetails(CajaRecepcion $item): array
    {
        $details = [];
        foreach (($item->costoItems ?? []) as $costItem) {
            $name = trim((string) ($costItem->nombre ?: optional($costItem->costo)->nombre));
            if ($name === '') {
                $name = 'Costo sin nombre';
            }
            if (!isset($details[$name])) {
                $details[$name] = ['monto' => 0.0, 'porcentaje' => $this->costPorcentaje($name), 'pagado' => true];
            }
            $details[$name]['monto'] += (float) ($costItem->monto ?? 0);
            $details[$name]['pagado'] = $details[$name]['pagado'] && (bool) $costItem->pagado;
        }

        foreach (self::LEGACY_COSTS as $name => $field) {
            if (array_key_exists($name, $details)) {
                // Ya viene de costoItems (p.ej. "Farmacia" se refleja en costo_farmacia); sumar de nuevo lo duplicaria.
                continue;
            }
            $value = (float) ($item->{$field} ?? 0);
            if ($value > 0) {
                $details[$name] = ['monto' => $value, 'porcentaje' => 100.0, 'pagado' => false];
            }
        }

        return $details;
    }

    private function costColumnSpecs(array $costColumns, int $startIndex): array
    {
        $specs = [];
        $fallback = 0;
        foreach ($costColumns as $name) {
            $clinicaPct = $this->costPorcentaje($name);
            $doctorPct = round(100 - $clinicaPct, 2);
            [$bg, $fg] = $this->costColor($name, $fallback);

            if ($doctorPct <= 0) {
                $headers = [mb_strtolower(trim($name)) === 'farmacia' ? 'Farmacia 100%' : 'Clinica 100%'];
            } else {
                $headers = [
                    'CLI ' . $this->pctLabel($clinicaPct),
                    $name . ' ' . $this->pctLabel($doctorPct),
                    'Total ' . mb_strtolower($name),
                ];
            }

            $specs[] = [
                'name' => $name,
                'headers' => $headers,
                'start' => $startIndex,
                'bg' => $bg,
                'fg' => $fg,
            ];
            $startIndex += count($headers);
        }

        return $specs;
    }

    private function costColor(string $name, int &$fallback): array
    {
        $key = mb_strtoupper(strtr(trim($name), [
            'á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u',
            'Á' => 'A', 'É' => 'E', 'Í' => 'I', 'Ó' => 'O', 'Ú' => 'U', 'ñ' => 'n', 'Ñ' => 'N',
        ]));
        if (isset(self::COST_COLORS[$key])) {
            return self::COST_COLORS[$key];
        }

        $bg = self::COST_FALLBACK_COLORS[$fallback % count(self::COST_FALLBACK_COLORS)];
        $fallback++;

        return [$bg, self::TEXT];
    }

    private function costRowCells(CajaRecepcion $item, array $costSpecs): array
    {
        $details = $this->itemCostDetails($item);
        $cells = [];
        foreach ($costSpecs as $spec) {
            $name = $spec['name'];
            $monto = round((float) ($details[$name]['monto'] ?? 0), 2);
            $porcentaje = (float) ($details[$name]['porcentaje'] ?? 100);
            $clinica = round($monto * $porcentaje / 100, 2);
            $doctor = round($monto - $clinica, 2);

            if (count($spec['headers']) === 1) {
                $cells[] = $monto;
            } else {
                $cells[] = $clinica;
                $cells[] = $doctor;
                $cells[] = $monto;
            }
        }

        return $cells;
    }

    private function metaText(): string
    {
        $parts = [
            'Generado: ' . now()->format('d/m/Y H:i'),
            'Registros: ' . $this->items->count(),
            'Usuario: ' . $this->userLabel,
        ];

        if (!empty($this->filters['fechaInicio']) || !empty($this->filters['fechaFin'])) {
            $parts[] = 'Rango: ' . ($this->filters['fechaInicio'] ?: '-') . ' a ' . ($this->filters['fechaFin'] ?: '-');
        }
        if (!empty($this->filters['search'])) {
            $parts[] = 'Busqueda: ' . $this->filters['search'];
        }

        return implode('     |     ', $parts);
    }

    private function tableHeaderStyle(string $bg, string $fg = self::WHITE): array
    {
        return [
            'font' => ['bold' => true, 'color' => ['argb' => 'FF' . $fg]],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF' . $bg]],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FF' . self::BORDER]]],
        ];
    }

    private function bodyRowStyle(int $row): array
    {
        return [
            'font' => ['size' => 9],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF' . ($row % 2 === 0 ? self::BG_ALT : 'FFFFFF')]],
            'borders' => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FF' . self::BORDER]]],
        ];
    }
}
