<?php

namespace App\Exports;

use App\Models\CajaRecepcion;
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
            'Documento', 'Atencion', 'QR', 'Efectivo', 'Egreso', 'Recaudado', 'Final',
        ];
        $distributionHeaders = [
            'CLI 30%', 'Laboratorio 70%', 'Total laboratorio',
            'CLI 20%', 'Ambulancia 80%', 'Total ambulancia',
            'CLI 20%', 'Atencion emergencia 80%', 'Total atencion emergencia',
            'CLI 70%', 'Ecografias 30%', 'Total ecografia',
        ];
        $headers = array_merge($baseHeaders, $costColumns, $distributionHeaders);
        $lastCol = Coordinate::stringFromColumnIndex(count($headers));

        $this->writeTitle($sheet, $lastCol);
        $this->writeKpis($sheet, $lastCol);

        $groupRow = 9;
        $headerRow = 10;
        $this->writeGroupHeader($sheet, 'A', 'J', $groupRow, 'DATOS DE CAJA', self::BG_BASE);
        $this->writeGroupHeader($sheet, 'K', 'O', $groupRow, 'PAGOS Y CIERRE', self::BG_PAYMENT);

        $costStart = count($baseHeaders) + 1;
        $costEnd = $costStart + count($costColumns) - 1;
        if ($costColumns) {
            $this->writeGroupHeader(
                $sheet,
                Coordinate::stringFromColumnIndex($costStart),
                Coordinate::stringFromColumnIndex($costEnd),
                $groupRow,
                'COSTOS REGISTRADOS',
                self::BG_COSTS
            );
        }

        $distributionStart = $costEnd + 1;
        $groups = [
            ['LABORATORIO', 3, 'EAB308'],
            ['AMBULANCIA', 3, 'A8A29E'],
            ['ATENCION EMERGENCIA', 3, 'F4B8AD'],
            ['ECOGRAFIA', 3, 'E8BF55'],
        ];
        foreach ($groups as [$title, $span, $color]) {
            $start = Coordinate::stringFromColumnIndex($distributionStart);
            $end = Coordinate::stringFromColumnIndex($distributionStart + $span - 1);
            $this->writeGroupHeader($sheet, $start, $end, $groupRow, $title, $color, self::TEXT);
            $distributionStart += $span;
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
            $costValues = $this->itemCostValues($item, $costColumns);
            $distributionValues = $this->distributionValues($item);
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
                (string) ($item->tipo_atencion ?? ''),
                (float) ($item->qr ?? 0),
                (float) ($item->efectivo ?? 0),
                (float) ($item->egreso ?? 0),
                (float) ($item->recaudado_total ?? 0),
                (float) ($item->saldo_final ?? 0),
            ], array_values($costValues), array_values($distributionValues));

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
            $sheet->getStyle("K{$dataRow}:{$lastCol}{$dataRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
            $sheet->getStyle("K{$dataRow}:{$lastCol}{$dataRow}")->getNumberFormat()->setFormatCode('#,##0.00');
            $sheet->getRowDimension($dataRow)->setRowHeight(18);
            $dataRow++;
        }

        $this->writeTotalsRow($sheet, $dataRow, $headers, $costColumns);
        $this->applyDetalleWidths($sheet, count($headers), count($baseHeaders), count($costColumns));

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
        $sheet->getStyle("A{$row}:B{$row}")->applyFromArray($this->tableHeaderStyle(self::BG_COSTS));
        $row++;

        foreach ($costColumns as $costName) {
            $total = $this->items->sum(fn ($item) => (float) ($this->itemCostValues($item, [$costName])[$costName] ?? 0));
            if ($total <= 0) {
                continue;
            }
            $sheet->setCellValue("A{$row}", $costName);
            $sheet->setCellValue("B{$row}", round($total, 2));
            $sheet->getStyle("A{$row}:B{$row}")->applyFromArray($this->bodyRowStyle($row));
            $sheet->getStyle("B{$row}")->getNumberFormat()->setFormatCode('#,##0.00');
            $row++;
        }

        $distStart = 8;
        $sheet->setCellValue("D{$distStart}", 'Distribucion');
        $sheet->setCellValue("E{$distStart}", 'CLI Bs');
        $sheet->setCellValue("F{$distStart}", 'Tercero Bs');
        $sheet->setCellValue("G{$distStart}", 'Total Bs');
        $sheet->getStyle("D{$distStart}:G{$distStart}")->applyFromArray($this->tableHeaderStyle('E8BF55', self::TEXT));
        $distRow = $distStart + 1;
        foreach ($this->distributionSummaryRows() as $rowData) {
            $sheet->setCellValue("D{$distRow}", $rowData['label']);
            $sheet->setCellValue("E{$distRow}", round($rowData['cli'], 2));
            $sheet->setCellValue("F{$distRow}", round($rowData['tercero'], 2));
            $sheet->setCellValue("G{$distRow}", round($rowData['total'], 2));
            $sheet->getStyle("D{$distRow}:G{$distRow}")->applyFromArray($this->bodyRowStyle($distRow));
            $sheet->getStyle("E{$distRow}:G{$distRow}")->getNumberFormat()->setFormatCode('#,##0.00');
            $distRow++;
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

    private function writeTotalsRow($sheet, int $row, array $headers, array $costColumns): void
    {
        $lastCol = Coordinate::stringFromColumnIndex(count($headers));
        $sheet->mergeCells("A{$row}:J{$row}");
        $sheet->setCellValue("A{$row}", 'TOTAL GENERAL');

        for ($colIndex = 11; $colIndex <= count($headers); $colIndex++) {
            $col = Coordinate::stringFromColumnIndex($colIndex);
            $start = 11;
            $end = max(11, $row - 1);
            $sheet->setCellValue("{$col}{$row}", "=SUM({$col}{$start}:{$col}{$end})");
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
        $sheet->getStyle("K{$row}:{$lastCol}{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getStyle("K{$row}:{$lastCol}{$row}")->getNumberFormat()->setFormatCode('#,##0.00');
        $sheet->getRowDimension($row)->setRowHeight(22);
    }

    private function applyDetalleWidths($sheet, int $headerCount, int $baseCount, int $costCount): void
    {
        $widths = [5, 11, 8, 10, 11, 28, 16, 20, 12, 16, 12, 12, 12, 13, 12];
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

    private function costColumns(): array
    {
        $columns = [];
        foreach ($this->items as $item) {
            foreach ($this->itemAllCosts($item) as $name => $value) {
                if ((float) $value > 0 && !in_array($name, $columns, true)) {
                    $columns[] = $name;
                }
            }
        }

        sort($columns, SORT_NATURAL | SORT_FLAG_CASE);
        return $columns;
    }

    private function itemCostValues(CajaRecepcion $item, array $costColumns): array
    {
        $all = $this->itemAllCosts($item);
        $values = [];
        foreach ($costColumns as $costName) {
            $values[$costName] = round((float) ($all[$costName] ?? 0), 2);
        }

        return $values;
    }

    private function itemAllCosts(CajaRecepcion $item): array
    {
        $costs = [];
        foreach (($item->costoItems ?? []) as $costItem) {
            $name = trim((string) ($costItem->nombre ?: optional($costItem->costo)->nombre));
            if ($name === '') {
                $name = 'Costo sin nombre';
            }
            $costs[$name] = ($costs[$name] ?? 0) + (float) ($costItem->monto ?? 0);
        }

        foreach (self::LEGACY_COSTS as $name => $field) {
            $value = (float) ($item->{$field} ?? 0);
            if ($value > 0) {
                $costs[$name] = ($costs[$name] ?? 0) + $value;
            }
        }

        return $costs;
    }

    private function distributionValues(CajaRecepcion $item): array
    {
        $laboratorio = $this->distributionBase($item, ['laboratorio']);
        $ambulancia = $this->distributionBase($item, ['ambulancia']);
        $emergencia = $this->distributionBase($item, ['emergencia', 'atencion medica']);
        $ecografia = $this->distributionBase($item, ['ecografia']);

        return [
            'lab_cli' => $laboratorio * 0.30,
            'lab_tercero' => $laboratorio * 0.70,
            'lab_total' => $laboratorio,
            'amb_cli' => $ambulancia * 0.20,
            'amb_tercero' => $ambulancia * 0.80,
            'amb_total' => $ambulancia,
            'eme_cli' => $emergencia * 0.20,
            'eme_tercero' => $emergencia * 0.80,
            'eme_total' => $emergencia,
            'eco_cli' => $ecografia * 0.70,
            'eco_tercero' => $ecografia * 0.30,
            'eco_total' => $ecografia,
        ];
    }

    private function distributionBase(CajaRecepcion $item, array $needles): float
    {
        $total = 0.0;
        foreach ($this->itemAllCosts($item) as $name => $value) {
            $normalized = mb_strtolower($name);
            foreach ($needles as $needle) {
                if (str_contains($normalized, $needle)) {
                    $total += (float) $value;
                    break;
                }
            }
        }

        return $total;
    }

    private function distributionSummaryRows(): array
    {
        $rows = [
            'Laboratorio' => ['cli' => 0, 'tercero' => 0, 'total' => 0],
            'Ambulancia' => ['cli' => 0, 'tercero' => 0, 'total' => 0],
            'Atencion emergencia' => ['cli' => 0, 'tercero' => 0, 'total' => 0],
            'Ecografia' => ['cli' => 0, 'tercero' => 0, 'total' => 0],
        ];

        foreach ($this->items as $item) {
            $values = $this->distributionValues($item);
            $rows['Laboratorio']['cli'] += $values['lab_cli'];
            $rows['Laboratorio']['tercero'] += $values['lab_tercero'];
            $rows['Laboratorio']['total'] += $values['lab_total'];
            $rows['Ambulancia']['cli'] += $values['amb_cli'];
            $rows['Ambulancia']['tercero'] += $values['amb_tercero'];
            $rows['Ambulancia']['total'] += $values['amb_total'];
            $rows['Atencion emergencia']['cli'] += $values['eme_cli'];
            $rows['Atencion emergencia']['tercero'] += $values['eme_tercero'];
            $rows['Atencion emergencia']['total'] += $values['eme_total'];
            $rows['Ecografia']['cli'] += $values['eco_cli'];
            $rows['Ecografia']['tercero'] += $values['eco_tercero'];
            $rows['Ecografia']['total'] += $values['eco_total'];
        }

        return collect($rows)
            ->map(fn ($row, $label) => ['label' => $label, ...$row])
            ->values()
            ->all();
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
