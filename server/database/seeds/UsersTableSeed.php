<?php

use Illuminate\Database\Seeder;
use App\User, App\UserProfile;

class UsersTableSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker\Factory::create('en_US');

        foreach(range(1, 20) as $index) {
            User::create([
                'user_guid' => $faker->uuid,
                'email' => $faker->email,
                'password' => bcrypt('password'),
                'first_name' => $faker->firstName,
                'last_name' => $faker->lastName,
                'hash' => $faker->md5
            ]);

            UserProfile::create([
                'user_profile_guid' => $faker->uuid,
                'user_id' => $index,
                'gender' => 'male',
                'about_me' => $faker->sentence($nbWords = 6)
            ]);
        }
    }
}
