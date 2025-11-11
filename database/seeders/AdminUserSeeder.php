<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create or update a known admin account so you can log in
        \App\Models\User::updateOrCreate(
            ['email' => 'ed.admin@example.com'],
            [
                'name' => 'Administrator',
                'password' => \Illuminate\Support\Facades\Hash::make('Password123'),
                'email_verified_at' => now(),
                'role' => 'admin',
            ]
        );
    }
}
