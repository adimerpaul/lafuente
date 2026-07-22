<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\HabitosPersonale>
 */
class HabitosPersonaleFactory extends Factory
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
            'fuma' => $this->faker->boolean(),
            'alcohol' => $this->faker->boolean(),
            'drogas' => $this->faker->boolean(),
            'zoonosis' => $this->faker->boolean(),
            'deportes' => $this->faker->boolean(),
            'vacunas' => $this->faker->boolean(),
        ];
    }
}
