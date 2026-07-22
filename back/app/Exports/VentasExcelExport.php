<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class VentasExcelExport
{
    private const BG_BRAND    = '1D4ED8';
    private const BG_HEADER   = '1E3A5F';
    private const FG_WHITE    = 'FFFFFF';
    private const BG_TITLE    = 'E0EDFF';
    private const FG_TITLE    = '1D4ED8';
    private const BG_ROW_ALT  = 'EFF6FF';
    private const BG_TOTAL    = 'DBEAFE';
    private const FG_TOTAL    = '1E3A5F';
    private const BORDER_SOFT = 'E5E7EB';
    private const FG_META     = '6B7280';

    private const MAX_CLIENTE = 30;
    private const MAX_USUARIO = 22;
    private const MAX_DETALLE = 48;

    private const COL_WIDTHS = [6, 12, 10, 24, 20, 13, 12, 13, 12, 36, 10, 15];

    public function __construct(
        private readonly Collection $ventas,
        private readonly string $title,
        private readonly string $farmaciaTipo,
        private readonly string $fileName,
        private readonly array $filters = [],
    ) {}

    public function download(): StreamedResponse
    {
        $spreadsheet = $this->build();

        return new StreamedResponse(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, 200, [
            'Content-Type'        => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="' . rawurlencode($this->fileName) . '.xlsx"',
            'Cache-Control'       => 'max-age=0',
            'Pragma'              => 'no-cache',
            'Expires'             => '0',
        ]);
    }

    private function build(): Spreadsheet
    {
        $spreadsheet = new Spreadsheet();
        $spreadsheet->getProperties()
            ->setCreator('Clínica La Fuente')
            ->setTitle($this->title)
            ->setSubject('Reporte de Ventas');

        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Ventas');
        $lastCol = Coordinate::stringFromColumnIndex(count(self::COL_WIDTHS));

        $sheet->mergeCells("A1:{$lastCol}1");
        $sheet->setCellValue('A1', 'CLÍNICA LA FUENTE');
        $sheet->getStyle("A1:{$lastCol}1")->applyFromArray([
            'font'      => ['bold' => true, 'size' => 15, 'color' => ['argb' => 'FF' . self::FG_WHITE]],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF' . self::BG_BRAND]],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);
        $sheet->getRowDimension(1)->setRowHeight(30);

        $sheet->mergeCells("A2:{$lastCol}2");
        $sheet->setCellValue('A2', $this->title . '  |  ' . $this->farmaciaTipo);
        $sheet->getStyle("A2:{$lastCol}2")->applyFromArray([
            'font'      => ['bold' => true, 'size' => 11, 'color' => ['argb' => 'FF' . self::FG_TITLE]],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF' . self::BG_TITLE]],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);
        $sheet->getRowDimension(2)->setRowHeight(20);

        $sheet->mergeCells("A3:{$lastCol}3");
        $sheet->setCellValue('A3', $this->metaText());
        $sheet->getStyle("A3:{$lastCol}3")->applyFromArray([
            'font'      => ['size' => 8, 'italic' => true, 'color' => ['argb' => 'FF' . self::FG_META]],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FFFAFAFA']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ]);
        $sheet->getRowDimension(3)->setRowHeight(13);
        $sheet->getRowDimension(4)->setRowHeight(4);

        $headers = ['ID', 'Fecha', 'Hora', 'Cliente', 'Usuario', 'Tipo venta', 'Tipo pago', 'Estado', 'Total Bs', 'Detalle', 'Facturado', 'Nro factura'];
        foreach ($headers as $i => $label) {
            $col = Coordinate::stringFromColumnIndex($i + 1);
            $sheet->setCellValue("{$col}5", $label);
        }
        $sheet->getStyle("A5:{$lastCol}5")->applyFromArray([
            'font'      => ['bold' => true, 'size' => 9, 'color' => ['argb' => 'FF' . self::FG_WHITE]],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF' . self::BG_HEADER]],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            'borders'   => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FF2D5F9E']]],
        ]);
        $sheet->getRowDimension(5)->setRowHeight(18);

        $dataRow = 6;
        foreach ($this->ventas as $idx => $venta) {
            $bg = ($idx % 2 === 1) ? self::BG_ROW_ALT : 'FFFFFF';

            $sheet->setCellValue("A{$dataRow}", $venta->id);
            $sheet->setCellValue("B{$dataRow}", $venta->fecha);
            $sheet->setCellValue("C{$dataRow}", $venta->hora);
            $sheet->setCellValue("D{$dataRow}", $this->clip((string) ($venta->nombre ?: optional($venta->cliente)->nombre), self::MAX_CLIENTE));
            $sheet->setCellValue("E{$dataRow}", $this->clip((string) optional($venta->user)->name, self::MAX_USUARIO));
            $sheet->setCellValue("F{$dataRow}", $venta->tipo_venta);
            $sheet->setCellValue("G{$dataRow}", $venta->tipo_pago);
            $sheet->setCellValue("H{$dataRow}", $venta->estado);
            $sheet->setCellValue("I{$dataRow}", (float) ($venta->total ?? 0));
            $sheet->setCellValue("J{$dataRow}", $this->clip((string) $venta->detailsText, self::MAX_DETALLE));
            $sheet->setCellValue("K{$dataRow}", $venta->facturado ? 'Sí' : 'No');
            $sheet->setCellValue("L{$dataRow}", $venta->numero_factura ?: '');

            $sheet->getStyle("A{$dataRow}:{$lastCol}{$dataRow}")->applyFromArray([
                'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF' . $bg]],
                'font'      => ['size' => 9],
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
                'borders'   => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FF' . self::BORDER_SOFT]]],
            ]);
            $sheet->getStyle("A{$dataRow}:C{$dataRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("F{$dataRow}:H{$dataRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("I{$dataRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
            $sheet->getStyle("I{$dataRow}")->getNumberFormat()->setFormatCode('#,##0.00');
            $sheet->getStyle("K{$dataRow}:L{$dataRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getRowDimension($dataRow)->setRowHeight(15);

            $dataRow++;
        }

        $this->writeTotals($sheet, $dataRow, $lastCol);

        foreach (self::COL_WIDTHS as $i => $width) {
            $col = Coordinate::stringFromColumnIndex($i + 1);
            $sheet->getColumnDimension($col)->setWidth($width);
        }

        $sheet->freezePane('A6');
        $sheet->setAutoFilter("A5:{$lastCol}5");
        $sheet->getPageSetup()
            ->setOrientation(PageSetup::ORIENTATION_LANDSCAPE)
            ->setPaperSize(PageSetup::PAPERSIZE_A4)
            ->setFitToWidth(1)
            ->setFitToHeight(0);

        $sheet->getHeaderFooter()
            ->setOddHeader('&C&B' . $this->title)
            ->setOddFooter('&LClínica La Fuente&C&P / &N&RGenerado: ' . now()->format('d/m/Y'));

        return $spreadsheet;
    }

    private function writeTotals($sheet, int $row, string $lastCol): void
    {
        $total = $this->ventas->sum(fn ($venta) => (float) ($venta->total ?? 0));
        $qr = $this->ventas
            ->filter(fn ($venta) => strtoupper((string) $venta->tipo_pago) === 'QR')
            ->sum(fn ($venta) => (float) ($venta->total ?? 0));
        $efectivo = $this->ventas
            ->filter(fn ($venta) => strtoupper((string) $venta->tipo_pago) === 'EFECTIVO')
            ->sum(fn ($venta) => (float) ($venta->total ?? 0));

        $sheet->mergeCells("A{$row}:H{$row}");
        $sheet->setCellValue("A{$row}", 'TOTAL GENERAL');
        $sheet->setCellValue("I{$row}", round($total, 2));
        $sheet->setCellValue("J{$row}", 'QR: ' . number_format((float) $qr, 2) . ' | Efectivo: ' . number_format((float) $efectivo, 2));

        $sheet->getStyle("A{$row}:{$lastCol}{$row}")->applyFromArray([
            'font'      => ['bold' => true, 'size' => 10, 'color' => ['argb' => 'FF' . self::FG_TOTAL]],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF' . self::BG_TOTAL]],
            'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
            'borders'   => [
                'top'    => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['argb' => 'FF' . self::BG_HEADER]],
                'bottom' => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['argb' => 'FF' . self::BG_HEADER]],
            ],
        ]);
        $sheet->getStyle("A{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getStyle("I{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getStyle("I{$row}")->getNumberFormat()->setFormatCode('#,##0.00');
        $sheet->getRowDimension($row)->setRowHeight(20);
    }

    private function metaText(): string
    {
        $parts = [
            'Generado: ' . now()->format('d/m/Y  H:i'),
            'Total de ventas: ' . $this->ventas->count(),
        ];

        if (!empty($this->filters['fechaInicio']) || !empty($this->filters['fechaFin'])) {
            $parts[] = 'Rango: ' . ($this->filters['fechaInicio'] ?: '-') . ' a ' . ($this->filters['fechaFin'] ?: '-');
        }
        if (!empty($this->filters['userLabel'])) {
            $parts[] = 'Usuario: ' . $this->filters['userLabel'];
        }
        if (!empty($this->filters['facturadoLabel'])) {
            $parts[] = 'Facturación: ' . $this->filters['facturadoLabel'];
        }

        return implode('     |     ', $parts);
    }

    private function clip(string $value, int $max): string
    {
        $value = trim($value);
        return mb_strlen($value) <= $max ? $value : mb_substr($value, 0, $max - 1) . '…';
    }
}
