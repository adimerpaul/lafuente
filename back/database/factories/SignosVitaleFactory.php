<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SignosVitale>
 */
class SignosVitaleFactory extends Factory
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
            'estado_general' => fake('es_ES')->sentence(),
            'fc' => $this->faker->numberBetween(60, 100),
            'fr' => $this->faker->numberBetween(12, 20),
            'pa' => $this->faker->numberBetween(60, 100),
            'temperatura' => $this->faker->randomFloat(2, 35, 40),
            'peso' => $this->faker->randomFloat(2, 40, 120),
            'talla' => $this->faker->randomFloat(2, 1.5, 2.2),
            'imc' => $this->faker->randomFloat(2, 15, 40),
            'spo2' => $this->faker->numberBetween(90, 100),
            'glasgow' => $this->faker->numberBetween(3, 15),
        ];
    }
}
