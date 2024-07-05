<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MerkBarang extends Model
{
    use HasFactory;

    protected $connection = 'mysqlsecond';
    protected $table = 'pj_merk_barang';
    protected $primaryKey = 'id_merk_barang';
    public $timestamps = false;

    protected $fillable = [
        'merk',
        'dihapus',
    ];
}
