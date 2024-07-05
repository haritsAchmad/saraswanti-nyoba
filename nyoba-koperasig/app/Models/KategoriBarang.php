<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KategoriBarang extends Model
{
    use HasFactory;

    protected $connection = 'mysqlsecond';
    protected $table = 'pj_kategori_barang';
    protected $primaryKey = 'id_kategori_barang';
    public $timestamps = false;

    protected $fillable = [
        'kategori',
        'dihapus',
    ];
}
