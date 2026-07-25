<?php

namespace App\Exports;

use App\Models\Internacion;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class InternacionArancelesExcelExport
{
    private const BRAND = '12395B';

    private const TITLE = 'DCEBFA';

    private const HEADER = '1F4E79';

    private const ALT = 'F7FBFF';

    private const TOTAL = 'DBEAFE';

    private const BORDER = 'CBD5E1';

    public function __construct(private readonly Internacion $internacion) {}

    public function download(): StreamedResponse
    {
        $spreadsheet = $this->build();
        $fileName = "Internacion_{$this->internacion->id}_Aranceles.xlsx";

        return new StreamedResponse(function () use ($spreadsheet) {
            (new Xlsx($spreadsheet))->save('php://output');
        }, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="'.rawurlencode($fileName).'"',
            'Cache-Control' => 'max-age=0',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }

    private function build(): Spreadsheet
    {
        $spreadsheet = new Spreadsheet;
        $spreadsheet->getProperties()
            ->setCreator('Clinica La Fuente')
            ->setTitle('Aranceles de internacion')
            ->setSubject('Detalle historico de aranceles aplicados');

        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Aranceles');
        $sheet->mergeCells('A1:I1')->setCellValue('A1', 'CLINICA LA FUENTE');
        $sheet->mergeCells('A2:I2')->setCellValue('A2', 'DETALLE DE ARANCELES DE INTERNACION');
        $sheet->getStyle('A1:I1')->applyFromArray([
            'font' => ['bold' => true, 'size' => 16, 'color' => ['argb' => 'FFFFFFFF']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF'.self::BRAND]],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ]);
        $sheet->getStyle('A2:I2')->applyFromArray([
            'font' => ['bold' => true, 'size' => 11, 'color' => ['argb' => 'FF'.self::BRAND]],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF'.self::TITLE]],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ]);
        $sheet->getRowDimension(1)->setRowHeight(28);

        $patient = $this->internacion->paciente;
        $meta = [
            ['Paciente', $patient->nombre_completo, 'Identificacion', $patient->identificacion ?: '-'],
            ['Internacion', '#'.$this->internacion->id, 'Cama', $this->internacion->cama],
            ['Fecha inicio', optional($this->internacion->fecha_inicio)->format('d/m/Y H:i'), 'Fecha finalizacion', optional($this->internacion->fecha_finalizacion)->format('d/m/Y H:i') ?: '-'],
            ['Estado', $this->internacion->estado, 'Registrada por', optional($this->internacion->user)->name ?: '-'],
        ];
        $row = 4;
        foreach ($meta as [$leftLabel, $leftValue, $rightLabel, $rightValue]) {
            $sheet->setCellValue("A{$row}", $leftLabel)->setCellValue("B{$row}", $leftValue);
            $sheet->mergeCells("B{$row}:D{$row}");
            $sheet->setCellValue("E{$row}", $rightLabel)->setCellValue("F{$row}", $rightValue);
            $sheet->mergeCells("F{$row}:I{$row}");
            $sheet->getStyle("A{$row}:I{$row}")->getBorders()->getBottom()
                ->setBorderStyle(Border::BORDER_HAIR)->getColor()->setARGB('FF'.self::BORDER);
            $sheet->getStyle("A{$row}")->getFont()->setBold(true)->getColor()->setARGB('FF64748B');
            $sheet->getStyle("E{$row}")->getFont()->setBold(true)->getColor()->setARGB('FF64748B');
            $row++;
        }

        $headerRow = 9;
        $headers = ['#', 'Fecha y hora', 'Categoria', 'Arancel', 'Tipo', 'Precio unitario', 'Cantidad', 'Total', 'Usuario'];
        foreach ($headers as $index => $header) {
            $column = Coordinate::stringFromColumnIndex($index + 1);
            $sheet->setCellValue("{$column}{$headerRow}", $header);
        }
        $sheet->getStyle("A{$headerRow}:I{$headerRow}")->applyFromArray([
            'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF'.self::HEADER]],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FF'.self::BORDER]]],
        ]);
        $sheet->getRowDimension($headerRow)->setRowHeight(22);

        $dataRow = 10;
        foreach ($this->internacion->arancelesAplicados as $index => $item) {
            $sheet->fromArray([
                $index + 1,
                optional($item->fecha_hora)->format('d/m/Y H:i'),
                $item->categoria,
                $item->nombre,
                $item->tipo_precio,
                (float) $item->precio_unitario,
                (float) $item->cantidad,
                (float) $item->total,
                optional($item->user)->name ?: '-',
            ], null, "A{$dataRow}");
            $sheet->getStyle("A{$dataRow}:I{$dataRow}")->applyFromArray([
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF'.($dataRow % 2 === 0 ? self::ALT : 'FFFFFF')]],
                'borders' => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FF'.self::BORDER]]],
                'alignment' => ['vertical' => Alignment::VERTICAL_TOP],
            ]);
            $dataRow++;
        }

        $totalRow = $dataRow;
        $sheet->mergeCells("A{$totalRow}:G{$totalRow}")->setCellValue("A{$totalRow}", 'TOTAL GENERAL');
        $sheet->setCellValue(
            "H{$totalRow}",
            $this->internacion->arancelesAplicados->isEmpty()
                ? 0
                : '=SUM(H10:H'.($totalRow - 1).')'
        );
        $sheet->getStyle("A{$totalRow}:I{$totalRow}")->applyFromArray([
            'font' => ['bold' => true, 'color' => ['argb' => 'FF'.self::BRAND]],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF'.self::TOTAL]],
            'borders' => ['top' => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['argb' => 'FF'.self::BRAND]]],
        ]);
        $sheet->getStyle("A{$totalRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getStyle("F10:H{$totalRow}")->getNumberFormat()->setFormatCode('"Bs " #,##0.00');

        $widths = [5, 18, 22, 34, 18, 16, 12, 16, 22];
        foreach ($widths as $index => $width) {
            $sheet->getColumnDimensionByColumn($index + 1)->setWidth($width);
        }
        $sheet->freezePane('A10');
        $sheet->setAutoFilter("A{$headerRow}:I{$headerRow}");
        $sheet->getPageSetup()->setOrientation(PageSetup::ORIENTATION_LANDSCAPE)
            ->setPaperSize(PageSetup::PAPERSIZE_LETTER)
            ->setFitToWidth(1)
            ->setFitToHeight(0);
        $sheet->getPageMargins()->setTop(0.35)->setBottom(0.35)->setLeft(0.25)->setRight(0.25);
        $sheet->getHeaderFooter()->setOddFooter('&LClinica La Fuente&C&P / &N&RGenerado: '.now()->format('d/m/Y H:i'));

        return $spreadsheet;
    }
}
