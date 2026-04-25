<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;

class CreateArancelPermissions extends Migration
{
    public function up()
    {
        Permission::findOrCreate('modificar aranceles', 'api');
    }

    public function down()
    {
        Permission::where('name', 'modificar aranceles')->delete();
    }
}
