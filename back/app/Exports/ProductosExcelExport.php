<?php

namespace App\Exports;

use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ProductosExcelExport
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

    private const MAX_NOMBRE = 42;
    private const MAX_DESC   = 32;
    private const MAX_UNIDAD = 14;

    // Anchos en caracteres para columnas A-I
    private const COL_WIDTHS = [4.5, 33, 28, 11, 13, 13, 13, 9, 9];

    public function __construct(
        private readonly array  $rows,
        private readonly string $title,
        private readonly string $farmaciaTipo,
        private readonly string $fileName,
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
            ->setSubject('Inventario de Productos');

        $sheet   = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Inventario');
        $lastCol = Coordinate::stringFromColumnIndex(count(self::COL_WIDTHS));

        // ── Fila 1: nombre de la clínica ──────────────────────────────
        $sheet->mergeCells("A1:{$lastCol}1");
        $sheet->setCellValue('A1', 'CLÍNICA LA FUENTE');
        $sheet->getStyle("A1:{$lastCol}1")->applyFromArray([
            'font'      => ['bold' => true, 'size' => 15, 'color' => ['argb' => 'FF' . self::FG_WHITE]],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF' . self::BG_BRAND]],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);
        $sheet->getRowDimension(1)->setRowHeight(30);

        // ── Fila 2: título del reporte ────────────────────────────────
        $sheet->mergeCells("A2:{$lastCol}2");
        $sheet->setCellValue('A2', $this->title . '  |  ' . $this->farmaciaTipo);
        $sheet->getStyle("A2:{$lastCol}2")->applyFromArray([
            'font'      => ['bold' => true, 'size' => 11, 'color' => ['argb' => 'FF' . self::FG_TITLE]],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF' . self::BG_TITLE]],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);
        $sheet->getRowDimension(2)->setRowHeight(20);

        // ── Fila 3: meta ──────────────────────────────────────────────
        $sheet->mergeCells("A3:{$lastCol}3");
        $sheet->setCellValue('A3',
            'Generado: ' . now()->format('d/m/Y  H:i') .
            '     |     Total de productos: ' . count($this->rows)
        );
        $sheet->getStyle("A3:{$lastCol}3")->applyFromArray([
            'font'      => ['size' => 8, 'italic' => true, 'color' => ['argb' => 'FF' . self::FG_META]],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FFFAFAFA']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ]);
        $sheet->getRowDimension(3)->setRowHeight(13);

        // ── Fila 4: espaciador ────────────────────────────────────────
        $sheet->getRowDimension(4)->setRowHeight(4);

        // ── Fila 5: encabezados ───────────────────────────────────────
        $headers = ['#', 'Producto', 'Descripción', 'Unidad', 'P. Compra', 'P. Venta', 'Existencia', 'St. Mín', 'St. Máx'];
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

        // ── Filas de datos ────────────────────────────────────────────
        $totalCompra = 0.0;
        $totalVenta  = 0.0;
        $dataRow     = 6;

        foreach ($this->rows as $idx => $item) {
            $bg = ($idx % 2 === 1) ? self::BG_ROW_ALT : 'FFFFFF';

            $nombre   = $this->clip((string) ($item['nombre']       ?? ''), self::MAX_NOMBRE);
            $desc     = $this->clip((string) ($item['descripcion']  ?? ''), self::MAX_DESC);
            $unidad   = $this->clip((string) ($item['unidad']       ?? ''), self::MAX_UNIDAD);
            $pCompra  = (float) ($item['precio_compra'] ?? 0);
            $pVenta   = (float) ($item['precio']        ?? 0);
            $cantidad = (float) ($item['cantidad']      ?? 0);
            $stMin    = is_numeric($item['stock_minimo'] ?? null) ? (int) $item['stock_minimo'] : null;
            $stMax    = is_numeric($item['stock_maximo'] ?? null) ? (int) $item['stock_maximo'] : null;

            $totalCompra += $pCompra * $cantidad;
            $totalVenta  += $pVenta  * $cantidad;

            $sheet->setCellValue("A{$dataRow}", $idx + 1);
            $sheet->setCellValue("B{$dataRow}", $nombre);
            $sheet->setCellValue("C{$dataRow}", $desc);
            $sheet->setCellValue("D{$dataRow}", $unidad);
            $sheet->setCellValue("E{$dataRow}", $pCompra  > 0 ? $pCompra  : null);
            $sheet->setCellValue("F{$dataRow}", $pVenta   > 0 ? $pVenta   : null);
            $sheet->setCellValue("G{$dataRow}", $cantidad > 0 ? $cantidad : null);
            $sheet->setCellValue("H{$dataRow}", $stMin);
            $sheet->setCellValue("I{$dataRow}", $stMax);

            $sheet->getStyle("A{$dataRow}:I{$dataRow}")->applyFromArray([
                'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF' . $bg]],
                'font'      => ['size' => 9],
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
                'borders'   => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FF' . self::BORDER_SOFT]]],
            ]);

            $sheet->getStyle("A{$dataRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("D{$dataRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("E{$dataRow}:I{$dataRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
            $sheet->getStyle("E{$dataRow}:F{$dataRow}")->getNumberFormat()->setFormatCode('#,##0.00');
            $sheet->getStyle("G{$dataRow}:I{$dataRow}")->getNumberFormat()->setFormatCode('#,##0');
            $sheet->getRowDimension($dataRow)->setRowHeight(15);

            $dataRow++;
        }

        // ── Fila de totales ───────────────────────────────────────────
        $sheet->mergeCells("A{$dataRow}:D{$dataRow}");
        $sheet->setCellValue("A{$dataRow}", 'TOTAL VALORADO');
        $sheet->setCellValue("E{$dataRow}", round($totalCompra, 2));
        $sheet->setCellValue("F{$dataRow}", round($totalVenta,  2));

        $sheet->getStyle("A{$dataRow}:I{$dataRow}")->applyFromArray([
            'font'      => ['bold' => true, 'size' => 10, 'color' => ['argb' => 'FF' . self::FG_TOTAL]],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF' . self::BG_TOTAL]],
            'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
            'borders'   => [
                'top'    => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['argb' => 'FF' . self::BG_HEADER]],
                'bottom' => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['argb' => 'FF' . self::BG_HEADER]],
            ],
        ]);
        $sheet->getStyle("A{$dataRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getStyle("E{$dataRow}:F{$dataRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getStyle("E{$dataRow}:F{$dataRow}")->getNumberFormat()->setFormatCode('#,##0.00');
        $sheet->getRowDimension($dataRow)->setRowHeight(20);

        // ── Anchos de columna ─────────────────────────────────────────
        foreach (self::COL_WIDTHS as $i => $width) {
            $col = Coordinate::stringFromColumnIndex($i + 1);
            $sheet->getColumnDimension($col)->setWidth($width);
        }

        // ── Panel fijo y autofiltro ────────────────────────────────────
        $sheet->freezePane('A6');
        $sheet->setAutoFilter("A5:{$lastCol}5");

        // ── Configuración de impresión ─────────────────────────────────
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

    private function clip(string $value, int $max): string
    {
        $value = trim($value);
        return mb_strlen($value) <= $max ? $value : mb_substr($value, 0, $max - 1) . '…';
    }
}
