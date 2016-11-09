<?php
namespace App\Helper;

use Illuminate\Database\Schema\Blueprint;
use Schema;

class DynamicSchema
{
    private $crude_json_schema;

    public function __construct(array $crude_json_schema)
    {
        $this->crude_json_schema = $crude_json_schema;
        return $this->parseAndBuild();
    }

    private function integerHelper(array $constraints)
    {
        if ($constraints["unique"] == true && $constraints["nullable"] == true) {
            return 0;
        } elseif ($constraints["unique"] == true && $constraints["nullable"] == false) {
            return 1;
        } elseif ($constraints["unique"] == false && $constraints["nullable"] == true) {
            return 2;
        } else {
            return 3;
        }
    }

    public function parseAndBuild()
    {
        Schema::create($this->crude_json_schema['table_name'], function (Blueprint $table) {
            $table->increments('id');

            foreach ($this->crude_json_schema['fields'] as $field => $constraints) {
                if ($constraints["data_type"] == "string") {
                    if ($constraints["unique"] == true && $constraints["nullable"] == true) {
                        $table->string($field, $constraints["length"])->unique()->nullable();
                        continue;
                    } elseif ($constraints["unique"] == true && $constraints["nullable"] == false) {
                        $table->string($field, $constraints["length"])->unique();
                        continue;
                    } elseif ($constraints["unique"] == false && $constraints["nullable"] == true) {
                        $table->string($field, $constraints["length"])->nullable();
                        continue;
                    } else {
                        $table->string($field, $constraints["length"]);
                        continue;
                    }
                }

                if ($constraints["data_type"] == "integer") {
                    switch ($this->integerHelper($constraints)) {
                        case 0:
                            if (isset($field, $this->crude_json_schema['foreign_keys'])) {
                                $table->integer($field)->unique()->nullable()->unsigned();
                            } else {
                                $table->integer($field)->unique()->nullable();
                            }

                            break;
                        case 1:
                            if (isset($field, $this->crude_json_schema['foreign_keys'])) {
                                $table->integer($field)->unique()->unsigned();
                            } else {
                                $table->integer($field)->unique();
                            }

                            break;
                        case 2:
                            if (isset($field, $this->crude_json_schema['foreign_keys'])) {
                                $table->integer($field)->nullable()->unsigned();
                            } else {
                                $table->integer($field)->nullable();
                            }

                            break;
                        case 3:
                            if (isset($field, $this->crude_json_schema['foreign_keys'])) {
                                $table->integer($field)->unsigned();
                            } else {
                                $table->integer($field);
                            }

                            break;
                    }
                }

                if ($constraints["data_type"] == "enum") {
                    $table->enum($field, $constraints['values']);
                }
            };

            if (!is_null($this->crude_json_schema['foreign_keys'])) {
                foreach ($this->crude_json_schema['foreign_keys'] as $field => $constraints) {
                    $table->foreign($field)->references($constraints['references'])->on($constraints["on"]);
                };
            }

            $table->timestamps();
        });

        return true;
    }
}
