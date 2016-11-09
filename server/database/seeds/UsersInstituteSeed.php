<?php

use App\UserInstitute;
use Illuminate\Database\Seeder;

class UsersInstituteSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Modify as per requirement ToDo

        UserInstitute::create([
            'user_id' => 10,
            'institute_id' => 1,
            'role' => 'inst_superuser'
        ]);

        UserInstitute::create([
            'user_id' => 10,
            'institute_id' => 6,
            'role' => 'inst_superuser'
        ]);

        UserInstitute::create([
            'user_id' => 2,
            'institute_id' => 2,
            'role' => 'inst_superuser'
        ]);

        UserInstitute::create([
            'user_id' => 2,
            'institute_id' => 8,
            'role' => 'inst_superuser'
        ]);

        UserInstitute::create([
            'user_id' => 2,
            'institute_id' => 10,
            'role' => 'inst_superuser'
        ]);

        UserInstitute::create([
            'user_id' => 4,
            'institute_id' => 4,
            'role' => 'inst_superuser'
        ]);
    }
}
