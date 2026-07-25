<?php

namespace App\Exports;

use App\Models\User;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FuncionarioActivosExcelExport
{
    public function __construct(private readonly User $funcionario, private readonly array $rows) {}

    public function download(): StreamedResponse
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Activos a cargo')->setShowGridlines(false);

        $sheet->mergeCells('A1:H1')->setCellValue('A1', 'CLÍNICA LA FUENTE');
        $sheet->mergeCells('A2:H2')->setCellValue('A2', 'ACTIVOS FIJOS BAJO RESPONSABILIDAD');
        $sheet->getStyle('A1:H1')->applyFromArray([
            'font' => ['bold' => true, 'size' => 16, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '283593']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ]);
        $sheet->getStyle('A2:H2')->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => '283593']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'E8EAF6']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ]);
        $sheet->setCellValue('A4', 'Funcionario')->setCellValue('B4', $this->funcionario->name);
        $sheet->setCellValue('D4', 'Cargo')->setCellValue('E4', $this->funcionario->role ?: '-');
        $sheet->setCellValue('G4', 'Generado')->setCellValue('H4', now()->format('d/m/Y H:i'));

        $headers = ['#', 'Código', 'Activo', 'Estado', 'Valor (Bs)', 'Fecha asignación', 'Asignado por', 'Observación'];
        $sheet->fromArray($headers, null, 'A6');
        $sheet->getStyle('A6:H6')->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '3949AB']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ]);

        foreach ($this->rows as $index => $item) {
            $row = $index + 7;
            $sheet->fromArray([
                $index + 1,
                $item['activo_fijo']['codigo'] ?? '',
                $item['activo_fijo']['nombre'] ?? '',
                $item['activo_fijo']['estado'] ?? '',
                (float) ($item['activo_fijo']['valor'] ?? 0),
                $item['fecha_asignacion'] ?? '',
                $item['asignador']['name'] ?? 'Sistema/migración',
                $item['observacion'] ?? '',
            ], null, "A{$row}");
            $sheet->getStyle("A{$row}:H{$row}")->applyFromArray([
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $index % 2 ? 'F3F4FA' : 'FFFFFF']],
                'borders' => ['bottom' => ['borderStyle' => Border::BORDER_HAIR, 'color' => ['rgb' => 'D9DCEB']]],
            ]);
            $sheet->getStyle("E{$row}")->getNumberFormat()->setFormatCode('"Bs" #,##0.00');
        }

        foreach (['A' => 5, 'B' => 18, 'C' => 34, 'D' => 17, 'E' => 16, 'F' => 21, 'G' => 26, 'H' => 38] as $column => $width) {
            $sheet->getColumnDimension($column)->setWidth($width);
        }
        $sheet->freezePane('A7')->setAutoFilter('A6:H'.max(6, count($this->rows) + 6));

        return new StreamedResponse(function () use ($spreadsheet) {
            (new Xlsx($spreadsheet))->save('php://output');
        }, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="activos_funcionario_'.$this->funcionario->id.'_'.now()->format('Ymd_His').'.xlsx"',
            'Cache-Control' => 'max-age=0',
        ]);
    }
}
