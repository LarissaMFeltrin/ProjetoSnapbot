<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DeviceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = DB::table('users')->where('email', 'admin@snapbot.com')->first();

        if ($user) {
            $devices = [
                [
                    'name' => 'iPhone 14 Pro',
                    'location' => 'Escritório Central',
                    'purchase_date' => '2023-01-15',
                    'in_use' => true,
                    'user_id' => $user->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'Samsung Galaxy S23',
                    'location' => 'Filial São Paulo',
                    'purchase_date' => '2023-03-20',
                    'in_use' => false,
                    'user_id' => $user->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'Xiaomi Redmi Note 12',
                    'location' => 'Escritório Central',
                    'purchase_date' => '2023-06-10',
                    'in_use' => true,
                    'user_id' => $user->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ];

            DB::table('devices')->insert($devices);
        }
    }
}
