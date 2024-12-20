<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AntecedentesFamiliare>
 */
class AntecedentesFamiliareFactory extends Factory
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
            'tuberculosis' => $this->faker->boolean(),
            'diabetes' => $this->faker->boolean(),
            'hipertension' => $this->faker->boolean(),
            'cardiopatia' => $this->faker->boolean(),
            'neumopatia' => $this->faker->boolean(),
            'hepatopatia' => $this->faker->boolean(),
            'nefropatia' => $this->faker->boolean(),
            'endocrinopatia' => $this->faker->boolean(),
            'epilepsia' => $this->faker->boolean(),
            'asma' => $this->faker->boolean(),
            'enfermedades_hematologicas' => $this->faker->boolean(),
            'neoplasias' => $this->faker->boolean(),
            'enfermedades_congenitas' => $this->faker->boolean(),
            'enfermedades_mentales' => $this->faker->boolean(),
            'vih' => $this->faker->boolean(),
            'violencia' => $this->faker->boolean(),
            'otros' => $this->faker->text(),
            'observaciones' => $this->faker->text(),
            'parentesco' => $this->faker->text(),
        ];
    }
}
