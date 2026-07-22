<?php

namespace App\Exports;

use App\Models\Paciente;
use Illuminate\Support\Collection;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ProformaPacienteExcelExport
{
    private const BG_BRAND = '1D4ED8';

    private const BG_HEADER = '1E3A5F';

    private const FG_WHITE = 'FFFFFF';

    private const BG_TITLE = 'E0EDFF';

    private const FG_TITLE = '1D4ED8';

    private const BG_ROW_ALT = 'EFF6FF';

    private const BG_TOTAL = 'DBEAFE';

    private const FG_TOTAL = '1E3A5F';

    private const BORDER_SOFT = 'E5E7EB';

    private const FG_META = '6B7280';

    private const COL_WIDTHS = [5, 9, 12, 9, 12, 12, 12, 16, 22, 8, 38, 11, 11, 12];

    public function __construct(
        private readonly Paciente $paciente,
        private readonly Collection $pacienteVentas,
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
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="'.rawurlencode($this->fileName).'.xlsx"',
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
            ->setTitle('Proforma de Farmacia')
            ->setSubject('Proforma de ventas vinculadas al paciente');

        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Proforma');
        $lastCol = Coordinate::stringFromColumnIndex(count(self::COL_WIDTHS));

        $sheet->mergeCells("A1:{$lastCol}1");
        $sheet->setCellValue('A1', 'CLINICA LA FUENTE');
        $sheet->getStyle("A1:{$lastCol}1")->applyFromArray([
            'font' => ['bold' => true, 'size' => 15, 'color' => ['argb' => 'FF'.self::FG_WHITE]],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF'.self::BG_BRAND]],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);
        $sheet->getRowDimension(1)->setRowHeight(30);

        $sheet->mergeCells("A2:{$lastCol}2");
        $sheet->setCellValue('A2', 'PROFORMA DE FARMACIA  |  '.$this->farmaciaTipo);
        $sheet->getStyle("A2:{$lastCol}2")->applyFromArray([
            'font' => ['bold' => true, 'size' => 11, 'color' => ['argb' => 'FF'.self::FG_TITLE]],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF'.self::BG_TITLE]],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);
        $sheet->getRowDimension(2)->setRowHeight(20);

        $sheet->mergeCells("A3:{$lastCol}3");
        $sheet->setCellValue('A3', $this->metaText());
        $sheet->getStyle("A3:{$lastCol}3")->applyFromArray([
            'font' => ['size' => 8, 'italic' => true, 'color' => ['argb' => 'FF'.self::FG_META]],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FFFAFAFA']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ]);
        $sheet->getRowDimension(3)->setRowHeight(13);
        $sheet->getRowDimension(4)->setRowHeight(4);

        $headers = ['#', 'Venta', 'Fecha', 'Hora', 'Tipo venta', 'Tipo pago', 'Pagado', 'Doctor', 'Registrado por', 'Cant.', 'Medicamento / Insumo', 'Unidad', 'P/U Bs', 'Importe Bs'];
        foreach ($headers as $i => $label) {
            $col = Coordinate::stringFromColumnIndex($i + 1);
            $sheet->setCellValue("{$col}5", $label);
        }

        $sheet->getStyle("A5:{$lastCol}5")->applyFromArray([
            'font' => ['bold' => true, 'size' => 9, 'color' => ['argb' => 'FF'.self::FG_WHITE]],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF'.self::BG_HEADER]],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FF2D5F9E']]],
        ]);

        $dataRow = 6;
        $line = 1;
        $totalGeneral = 0.0;

        foreach ($this->pacienteVentas as $pv) {
            $venta = $pv->venta;
            if (! $venta) {
                continue;
            }

            $detalles = $venta->ventaDetalles;
            $ventaTotal = 0.0;

            if ($detalles->isEmpty()) {
                $ventaTotal = (float) ($venta->total ?? 0);
                $this->writeRow($sheet, $dataRow, $lastCol, $line++, $pv, null, $ventaTotal);
                $dataRow++;
            } else {
                foreach ($detalles as $detalle) {
                    $importe = (float) ($detalle->cantidad ?? 0) * (float) ($detalle->precio ?? 0);
                    $ventaTotal += $importe;
                    $this->writeRow($sheet, $dataRow, $lastCol, $line++, $pv, $detalle, $importe);
                    $dataRow++;
                }
            }

            $totalGeneral += $venta->total === null ? $ventaTotal : (float) $venta->total;
        }

        $this->writeTotals($sheet, $dataRow, $lastCol, $totalGeneral);

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
            ->setOddHeader('&C&BProforma de Farmacia')
            ->setOddFooter('&LClinica La Fuente&C&P / &N&RGenerado: '.now()->format('d/m/Y'));

        return $spreadsheet;
    }

    private function writeRow($sheet, int $row, string $lastCol, int $line, $pv, $detalle, float $importe): void
    {
        $venta = $pv->venta;
        $doctor = $venta->doctor;
        $bg = ($line % 2 === 0) ? self::BG_ROW_ALT : 'FFFFFF';

        $sheet->setCellValue("A{$row}", $line);
        $sheet->setCellValue("B{$row}", $venta->id);
        $sheet->setCellValue("C{$row}", $venta->fecha ?: $pv->fecha);
        $sheet->setCellValue("D{$row}", $venta->hora ?: $pv->hora);
        $sheet->setCellValue("E{$row}", $venta->tipo_venta === 'Interno' ? 'Internado' : $venta->tipo_venta);
        $sheet->setCellValue("F{$row}", $venta->tipo_pago);
        $sheet->setCellValue("G{$row}", (int) ($venta->pagado_interno ?? 0) === 1 ? 'SI' : 'NO');
        $sheet->setCellValue("H{$row}", $doctor ? trim((string) $doctor->nombre) : '');
        $sheet->setCellValue("I{$row}", optional($pv->user)->name);
        $sheet->setCellValue("J{$row}", $detalle ? (float) ($detalle->cantidad ?? 0) : null);
        $sheet->setCellValue("K{$row}", $detalle ? $this->clip((string) ($detalle->producto?->nombre ?? $detalle->nombre ?? ''), 50) : $this->clip((string) $venta->detailsText, 50));
        $sheet->setCellValue("L{$row}", $detalle ? (string) ($detalle->producto?->unidad ?? $detalle->unidad ?? '') : '');
        $sheet->setCellValue("M{$row}", $detalle ? (float) ($detalle->precio ?? 0) : null);
        $sheet->setCellValue("N{$row}", round($importe, 2));

        $sheet->getStyle("A{$row}:{$lastCol}{$row}")->applyFromArray([
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF'.$bg]],
            'font' => ['size' => 9],
            'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
            'borders' => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FF'.self::BORDER_SOFT]]],
        ]);
        $sheet->getStyle("A{$row}:G{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle("J{$row}:N{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getStyle("M{$row}:N{$row}")->getNumberFormat()->setFormatCode('#,##0.00');
        $sheet->getRowDimension($row)->setRowHeight(16);
    }

    private function writeTotals($sheet, int $row, string $lastCol, float $totalGeneral): void
    {
        $sheet->mergeCells("A{$row}:M{$row}");
        $sheet->setCellValue("A{$row}", 'MONTO TOTAL');
        $sheet->setCellValue("N{$row}", round($totalGeneral, 2));

        $sheet->getStyle("A{$row}:{$lastCol}{$row}")->applyFromArray([
            'font' => ['bold' => true, 'size' => 10, 'color' => ['argb' => 'FF'.self::FG_TOTAL]],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF'.self::BG_TOTAL]],
            'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
            'borders' => [
                'top' => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['argb' => 'FF'.self::BG_HEADER]],
                'bottom' => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['argb' => 'FF'.self::BG_HEADER]],
            ],
        ]);
        $sheet->getStyle("A{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getStyle("N{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getStyle("N{$row}")->getNumberFormat()->setFormatCode('#,##0.00');
        $sheet->getRowDimension($row)->setRowHeight(20);
    }

    private function metaText(): string
    {
        $nombre = trim((string) ($this->paciente->nombre_completo ?: ($this->paciente->nombre.' '.$this->paciente->apellido)));
        $ci = $this->paciente->identificacion ? 'CI: '.$this->paciente->identificacion : 'CI: -';

        return implode('     |     ', [
            'Paciente: '.($nombre ?: 'SN'),
            $ci,
            'Ventas: '.$this->pacienteVentas->count(),
            'Generado: '.now()->format('d/m/Y  H:i'),
        ]);
    }

    private function clip(string $value, int $max): string
    {
        $value = trim($value);

        return mb_strlen($value) <= $max ? $value : mb_substr($value, 0, $max - 1).'...';
    }
}
