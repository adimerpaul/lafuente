<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;

class CreateArancelPermissions extends Migration
{
    public function up()
    {
        Permission::findOrCreate('Modificar aranceles', 'web');
    }

    public function down()
    {
        Permission::where('name', 'Modificar aranceles')->delete();
    }
}
