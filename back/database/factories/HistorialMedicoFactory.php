<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\HistorialMedico>
 */
class HistorialMedicoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'paciente_id' => 1,
            'fecha_consulta' => fake()->date(),
            'hora_consulta' => fake()->time(),
            'referido_de' => fake('es_ES')->company(),
            'motivo_consulta' => fake('es_ES')->sentence(),
            'enfermedad_actual' => fake('es_ES')->sentence(),
            'alergias_conocidas' => fake('es_ES')->sentence(),
        ];
    }
}
