<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request;
use App\Models\KategoriBarang;
use Illuminate\Validation\Rule;
use DataTables;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;

class KategoriBarangController extends Controller
{
    protected $kategoribarang;

    public function __construct(KategoriBarang $kategoribarang)
    {
        $this->kategoribarang = $kategoribarang;
    }

    public function index()
    {
        $y = KategoriBarang::all();


        return response()->json($y);
    }
}