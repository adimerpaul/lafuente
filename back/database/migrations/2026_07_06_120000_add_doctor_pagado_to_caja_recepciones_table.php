<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('caja_recepciones', function (Blueprint $table) {
            $table->boolean('doctor_pagado')->default(false)->after('egreso');
            $table->dateTime('doctor_pagado_at')->nullable()->after('doctor_pagado');
            $table->unsignedBigInteger('doctor_pagado_por_user_id')->nullable()->after('doctor_pagado_at');
            $table->foreign('doctor_pagado_por_user_id')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::table('caja_recepciones', function (Blueprint $table) {
            $table->dropForeign(['doctor_pagado_por_user_id']);
            $table->dropColumn(['doctor_pagado', 'doctor_pagado_at', 'doctor_pagado_por_user_id']);
        });
    }
};
