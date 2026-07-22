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
            'Documento', 'N Factura', 'Atencion', 'QR', 'Efectivo', 'Egreso', 'Recaudado', 'Final',
        ];
        $costHeaders = [];
        foreach ($costColumns as $costName) {
            $clinicaPct = $this->costPorcentaje($costName);
            $doctorPct = round(100 - $clinicaPct, 2);
            array_push(
                $costHeaders,
                'Monto',
                'Doctor ' . $this->pctLabel($doctorPct),
                'Clinica ' . $this->pctLabel($clinicaPct),
                'Pagado doctor'
            );
        }
        $headers = array_merge($baseHeaders, $costHeaders);
        $lastCol = Coordinate::stringFromColumnIndex(count($headers));

        $this->writeTitle($sheet, $lastCol);
        $this->writeKpis($sheet, $lastCol);

        $groupRow = 9;
        $headerRow = 10;
        $this->writeGroupHeader($sheet, 'A', 'K', $groupRow, 'DATOS DE CAJA', self::BG_BASE);
        $this->writeGroupHeader($sheet, 'L', 'P', $groupRow, 'PAGOS Y CIERRE', self::BG_PAYMENT);

        $costStart = count($baseHeaders) + 1;
        foreach ($costColumns as $index => $costName) {
            $start = Coordinate::stringFromColumnIndex($costStart + $index * 4);
            $end = Coordinate::stringFromColumnIndex($costStart + $index * 4 + 3);
            $bg = $index % 2 === 0 ? self::BG_COSTS : '8D6E63';
            $this->writeGroupHeader($sheet, $start, $end, $groupRow, mb_strtoupper($costName), $bg);
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
                (string) ($item->documento_label ?? ''),
                (string) ($item->nombre_factura ?? ''),
                (string) ($item->tipo_atencion ?? ''),
                (float) ($item->qr ?? 0),
                (float) ($item->efectivo ?? 0),
                (float) ($item->egreso ?? 0),
                (float) ($item->recaudado_total ?? 0),
                (float) ($item->saldo_final ?? 0),
            ], $this->costRowCells($item, $costColumns));

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
            $sheet->getStyle("L{$dataRow}:{$lastCol}{$dataRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
            $sheet->getStyle("L{$dataRow}:{$lastCol}{$dataRow}")->getNumberFormat()->setFormatCode('#,##0.00');
            $sheet->getRowDimension($dataRow)->setRowHeight(18);
            $dataRow++;
        }

        $this->writeTotalsRow($sheet, $dataRow, $headers, count($baseHeaders));
        $this->applyDetalleWidths($sheet, count($headers), count($baseHeaders), count($costColumns) * 4);

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

        $row = 8;
        $sheet->setCellValue("A{$row}", 'Costo');
        $sheet->setCellValue("B{$row}", 'Total Bs');
        $sheet->setCellValue("C{$row}", 'Doctor Bs');
        $sheet->setCellValue("D{$row}", 'Clinica Bs');
        $sheet->getStyle("A{$row}:D{$row}")->applyFromArray($this->tableHeaderStyle(self::BG_COSTS));
        $row++;

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
            if ($total <= 0) {
                continue;
            }
            $sheet->setCellValue("A{$row}", $costName);
            $sheet->setCellValue("B{$row}", round($total, 2));
            $sheet->setCellValue("C{$row}", round($doctor, 2));
            $sheet->setCellValue("D{$row}", round($clinica, 2));
            $sheet->getStyle("A{$row}:D{$row}")->applyFromArray($this->bodyRowStyle($row));
            $sheet->getStyle("B{$row}:D{$row}")->getNumberFormat()->setFormatCode('#,##0.00');
            $row++;
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

    private function writeTotalsRow($sheet, int $row, array $headers, int $baseCount): void
    {
        $lastCol = Coordinate::stringFromColumnIndex(count($headers));
        $sheet->mergeCells("A{$row}:K{$row}");
        $sheet->setCellValue("A{$row}", 'TOTAL GENERAL (solo Pagado)');

        $start = 11;
        $end = max($start, $row - 1);
        $cobroCol = 'E';

        for ($colIndex = 12; $colIndex <= count($headers); $colIndex++) {
            if ($colIndex > $baseCount && ($colIndex - $baseCount) % 4 === 0) {
                // Columna "Pagado doctor" (texto Si/No): no se suma.
                continue;
            }
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
        $sheet->getStyle("L{$row}:{$lastCol}{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getStyle("L{$row}:{$lastCol}{$row}")->getNumberFormat()->setFormatCode('#,##0.00');
        $sheet->getRowDimension($row)->setRowHeight(22);
    }

    private function applyDetalleWidths($sheet, int $headerCount, int $baseCount, int $costCount): void
    {
        $widths = [5, 11, 8, 10, 11, 28, 16, 20, 12, 14, 16, 12, 12, 12, 13, 12];
        foreach ($widths as $index => $width) {
            $sheet->getColumnDimension(Coordinate::stringFromColumnIndex($index + 1))->setWidth($width);
        }
        for ($i = $baseCount + 1; $i <= $baseCount + $costCount; $i++) {
            $sheet->getColumnDimension(Coordinate::stringFromColumnIndex($i))->setWidth(13);
        }
        for ($i = $baseCount + $costCount + 1; $i <= $headerCount; $i++) {
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

    private function costRowCells(CajaRecepcion $item, array $costColumns): array
    {
        $details = $this->itemCostDetails($item);
        $cells = [];
        foreach ($costColumns as $name) {
            $monto = round((float) ($details[$name]['monto'] ?? 0), 2);
            $porcentaje = (float) ($details[$name]['porcentaje'] ?? 100);
            $clinica = round($monto * $porcentaje / 100, 2);
            $doctor = round($monto - $clinica, 2);
            $cells[] = $monto;
            $cells[] = $doctor;
            $cells[] = $clinica;
            $cells[] = $monto > 0 ? (($details[$name]['pagado'] ?? false) ? 'Si' : 'No') : '';
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
