<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request;
use App\Models\Barang;
use App\Models\KategoriBarang;
use Illuminate\Validation\Rule;
use DataTables;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;

class BarangController extends Controller
{
    protected $barang;

    public function __construct(Barang $barang)
    {
        $this->barang = $barang;
    }

    public function index()
    {
        $y = Barang::all()->map(function ($y) {
            $k = KategoriBarang::find($y->id_kategori_barang);
            if ($k) {
                $y->kategori = $k->kategori;
            } else {
                $y->kategori = '';
            }

            return $y;
        });


        return response()->json($y);
    }
}