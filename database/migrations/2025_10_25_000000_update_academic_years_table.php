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
        Schema::table('academic_years', function (Blueprint $table) {
            if (!Schema::hasColumn('academic_years', 'year')) {
                $table->string('year')->nullable()->after('id');
            }

            if (!Schema::hasColumn('academic_years', 'start_date')) {
                $table->date('start_date')->nullable()->after('year');
            }

            if (!Schema::hasColumn('academic_years', 'end_date')) {
                $table->date('end_date')->nullable()->after('start_date');
            }

            if (!Schema::hasColumn('academic_years', 'is_current')) {
                $table->boolean('is_current')->default(false)->after('end_date');
            }

            if (!Schema::hasColumn('academic_years', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('is_current');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('academic_years', function (Blueprint $table) {
            if (Schema::hasColumn('academic_years', 'is_active')) {
                $table->dropColumn('is_active');
            }
            if (Schema::hasColumn('academic_years', 'is_current')) {
                $table->dropColumn('is_current');
            }
            if (Schema::hasColumn('academic_years', 'end_date')) {
                $table->dropColumn('end_date');
            }
            if (Schema::hasColumn('academic_years', 'start_date')) {
                $table->dropColumn('start_date');
            }
            if (Schema::hasColumn('academic_years', 'year')) {
                $table->dropColumn('year');
            }
        });
    }
};
