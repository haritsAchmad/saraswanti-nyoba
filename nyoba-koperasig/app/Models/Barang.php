<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    use HasFactory;

    protected $connection = 'mysqlsecond';
    protected $table = 'pj_barang';
    protected $primaryKey = 'id_barang';
    public $timestamps = false;

    protected $fillable = [
        'kode_barang',
        'nama_barang',
        'size',
        'total_stok',
        'harga',
        'id_kategori_barang',
        'id_merk_barang',
        'keterangan',
        'dihapus',
        'modal',
    ];
}
