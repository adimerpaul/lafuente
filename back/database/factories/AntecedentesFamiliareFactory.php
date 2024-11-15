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
        ];
    }
}
