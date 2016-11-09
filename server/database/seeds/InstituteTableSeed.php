<?php

use App\Institute;
use Illuminate\Database\Seeder;

class InstituteTableSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker\Factory::create('en_US');

        foreach(range(1, 10) as $index) {
            Institute::create([
                'inst_profile_guid' => $faker->uuid,
                'user_id' => rand(1, 20),
                'institute_code' => $faker->postcode,
                'institute_name' => $faker->company,
                'institute_description' => $faker->sentence,
                'contact' => $faker->phoneNumber,
                'address' => $faker->address,
                'city' => $faker->city,
                'postal_code' => $faker->postcode,
                'country' => $faker->country
            ]);
        }
    }
}
