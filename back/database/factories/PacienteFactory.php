<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PacienteFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nombre' => fake('es_ES')->firstName(),
            'apellido' => fake('es_ES')->lastName(),
            'fecha_nacimiento' => fake('es_ES')->date(),
            'identificacion' => fake('es_ES')->unique()->randomNumber(9, true), // Asegura un número de 9 dígitos
            'edad' => fake('es_ES')->numberBetween(1, 100),
            'sexo' => fake('es_ES')->randomElement(['M', 'F']),
            'estado_civil' => fake('es_ES')->randomElement(['Soltero', 'Casado', 'Divorciado', 'Viudo']),
            'direccion' => fake('es_ES')->address(),
            'telefono' => fake('es_ES')->phoneNumber(),
        ];
    }
}
