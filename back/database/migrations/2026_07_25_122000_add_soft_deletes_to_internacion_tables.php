<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('internaciones', 'deleted_at')) {
            Schema::table('internaciones', function (Blueprint $table) {
                $table->softDeletes();
            });
        }

        if (! Schema::hasColumn('arancel_internaciones', 'deleted_at')) {
            Schema::table('arancel_internaciones', function (Blueprint $table) {
                $table->softDeletes();
            });
        }

        if (! Schema::hasColumn('internacion_aranceles', 'deleted_at')) {
            Schema::table('internacion_aranceles', function (Blueprint $table) {
                $table->softDeletes();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('internacion_aranceles', 'deleted_at')) {
            Schema::table('internacion_aranceles', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }

        if (Schema::hasColumn('arancel_internaciones', 'deleted_at')) {
            Schema::table('arancel_internaciones', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }

        if (Schema::hasColumn('internaciones', 'deleted_at')) {
            Schema::table('internaciones', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }
    }
};
