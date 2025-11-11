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
            if (!Schema::hasColumn('faculty', 'middle_name')) {
                $table->string('middle_name')->nullable()->after('first_name');
            }
            if (!Schema::hasColumn('faculty', 'emergency_contact')) {
                $table->string('emergency_contact')->nullable()->after('phone');
            }
            if (!Schema::hasColumn('faculty', 'photo')) {
                $table->string('photo')->nullable()->after('emergency_contact');
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
            if (Schema::hasColumn('faculty', 'photo')) {
                $table->dropColumn('photo');
            }
            if (Schema::hasColumn('faculty', 'emergency_contact')) {
                $table->dropColumn('emergency_contact');
            }
            if (Schema::hasColumn('faculty', 'middle_name')) {
                $table->dropColumn('middle_name');
            }
        });
    }
};
