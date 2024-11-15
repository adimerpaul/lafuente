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
//            $table->foreignId('paciente_id')->constrained('pacientes');
//        $table->boolean('fuma')->nullable();
//        $table->boolean('alcohol')->nullable();
//        $table->boolean('drogas')->nullable();
//        $table->boolean('zoonosis')->nullable();
//        $table->boolean('deportes')->nullable();
//        $table->boolean('vacunas')->nullable();
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
