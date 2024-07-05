<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request;
use App\Models\MerkBarang;
use Illuminate\Validation\Rule;
use DataTables;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;

class MerkBarangController extends Controller
{
    protected $merkbarang;

    public function __construct(MerkBarang $merkbarang)
    {
        $this->merkbarang = $merkbarang;
    }

    public function index()
    {
        $y = MerkBarang::all();


        return response()->json($y);
    }
}