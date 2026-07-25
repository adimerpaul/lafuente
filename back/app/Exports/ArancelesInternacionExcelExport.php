<?php

namespace App\Exports;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ArancelesInternacionExcelExport
{
    public function __construct(
        private readonly array $rows,
        private readonly string $search = '',
    ) {}

    public function download(): StreamedResponse
    {
        $spreadsheet = $this->build();

        return new StreamedResponse(function () use ($spreadsheet) {
            (new Xlsx($spreadsheet))->save('php://output');
        }, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="aranceles_internacion_'.now()->format('Ymd_His').'.xlsx"',
            'Cache-Control' => 'max-age=0',
        ]);
    }

    private function build(): Spreadsheet
    {
        $spreadsheet = new Spreadsheet();
        $spreadsheet->getProperties()
            ->setCreator('Clínica La Fuente')
            ->setTitle('Catálogo de aranceles de internación')
            ->setSubject('Servicios y procedimientos de internación');

        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Aranceles');
        $sheet->setShowGridlines(false);

        $sheet->mergeCells('A1:I1');
        $sheet->setCellValue('A1', 'CLÍNICA LA FUENTE');
        $sheet->getStyle('A1:I1')->applyFromArray([
            'font' => ['bold' => true, 'size' => 16, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '0F4C81']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);
        $sheet->getRowDimension(1)->setRowHeight(30);

        $sheet->mergeCells('A2:I2');
        $sheet->setCellValue('A2', 'CATÁLOGO DE ARANCELES DE INTERNACIÓN');
        $sheet->getStyle('A2:I2')->applyFromArray([
            'font' => ['bold' => true, 'size' => 12, 'color' => ['rgb' => '0F4C81']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'EAF2F8']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ]);

        $activeCount = count(array_filter($this->rows, fn ($row) => (bool) ($row['activo'] ?? false)));
        $fixedTotal = array_sum(array_map(
            fn ($row) => is_numeric($row['precio'] ?? null) ? (float) $row['precio'] : 0,
            $this->rows
        ));
        $sheet->setCellValue('A3', 'Generado');
        $sheet->setCellValue('B3', now()->format('d/m/Y H:i'));
        $sheet->setCellValue('D3', 'Registros');
        $sheet->setCellValue('E3', count($this->rows));
        $sheet->setCellValue('G3', 'Activos');
        $sheet->setCellValue('H3', $activeCount);
        $sheet->setCellValue('A4', 'Filtro');
        $sheet->mergeCells('B4:E4');
        $sheet->setCellValue('B4', $this->search !== '' ? $this->search : 'Todos');
        $sheet->setCellValue('G4', 'Suma precios');
        $sheet->setCellValue('H4', $fixedTotal);
        $sheet->getStyle('A3:I4')->getFont()->setSize(9);
        $sheet->getStyle('A3:A4')->getFont()->setBold(true);
        $sheet->getStyle('D3:D4')->getFont()->setBold(true);
        $sheet->getStyle('G3:G4')->getFont()->setBold(true);
        $sheet->getStyle('H4')->getNumberFormat()->setFormatCode('"Bs" #,##0.00');

        $headers = ['#', 'Categoría', 'Grupo', 'Nombre', 'Detalle', 'Tipo de precio', 'Precio (Bs)', 'Manual', 'Estado'];
        $sheet->fromArray($headers, null, 'A6');
        $sheet->getStyle('A6:I6')->applyFromArray([
            'font' => ['bold' => true, 'size' => 9, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '1E3A5F']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            'borders' => ['bottom' => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['rgb' => '0F4C81']]],
        ]);
        $sheet->getRowDimension(6)->setRowHeight(22);

        $rowNumber = 7;
        foreach ($this->rows as $index => $row) {
            $sheet->fromArray([
                $index + 1,
                $row['categoria'] ?? '',
                $row['grupo'] ?? '',
                $row['nombre'] ?? '',
                $row['detalle'] ?? '',
                $row['tipo_precio'] ?? '',
                is_numeric($row['precio'] ?? null) ? (float) $row['precio'] : null,
                ! empty($row['permite_precio_manual']) ? 'Sí' : 'No',
                ! empty($row['activo']) ? 'Activo' : 'Inactivo',
            ], null, "A{$rowNumber}");

            $fillColor = $index % 2 === 0 ? 'FFFFFF' : 'F4F8FB';
            $sheet->getStyle("A{$rowNumber}:I{$rowNumber}")->applyFromArray([
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $fillColor]],
                'font' => ['size' => 9],
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
                'borders' => ['bottom' => ['borderStyle' => Border::BORDER_HAIR, 'color' => ['rgb' => 'D9E2EC']]],
            ]);
            $sheet->getStyle("G{$rowNumber}")->getNumberFormat()->setFormatCode('"Bs" #,##0.00');
            $sheet->getStyle("A{$rowNumber}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("G{$rowNumber}:I{$rowNumber}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("E{$rowNumber}")->getAlignment()->setWrapText(true);
            $sheet->getRowDimension($rowNumber)->setRowHeight(20);
            $rowNumber++;
        }

        $sheet->getColumnDimension('A')->setWidth(5);
        $sheet->getColumnDimension('B')->setWidth(20);
        $sheet->getColumnDimension('C')->setWidth(20);
        $sheet->getColumnDimension('D')->setWidth(34);
        $sheet->getColumnDimension('E')->setWidth(38);
        $sheet->getColumnDimension('F')->setWidth(18);
        $sheet->getColumnDimension('G')->setWidth(16);
        $sheet->getColumnDimension('H')->setWidth(11);
        $sheet->getColumnDimension('I')->setWidth(12);
        $sheet->freezePane('A7');
        $sheet->setAutoFilter('A6:I'.max(6, $rowNumber - 1));
        $sheet->getPageSetup()
            ->setOrientation(PageSetup::ORIENTATION_LANDSCAPE)
            ->setPaperSize(PageSetup::PAPERSIZE_A4)
            ->setFitToWidth(1)
            ->setFitToHeight(0);
        $sheet->getPageMargins()
            ->setTop(0.4)->setBottom(0.5)->setLeft(0.3)->setRight(0.3);
        $sheet->getHeaderFooter()
            ->setOddHeader('&C&BClínica La Fuente - Aranceles de internación')
            ->setOddFooter('&LGenerado '.now()->format('d/m/Y').'&C&P / &N&RClínica La Fuente');

        return $spreadsheet;
    }
}
