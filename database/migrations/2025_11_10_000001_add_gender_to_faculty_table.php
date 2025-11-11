<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('faculty')) {
            return;
        }

        Schema::table('faculty', function (Blueprint $table) {
            if (!Schema::hasColumn('faculty', 'gender')) {
                $table->string('gender')->nullable()->after('phone');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasTable('faculty')) {
            return;
        }

        Schema::table('faculty', function (Blueprint $table) {
            if (Schema::hasColumn('faculty', 'gender')) {
                $table->dropColumn('gender');
            }
        });
    }
};
