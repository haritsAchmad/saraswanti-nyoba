<?php
 
 namespace App\Http\Controllers;

 use Illuminate\Http\Request;
 use App\Models\Akses;
 use Illuminate\Validation\Rule;
 use DataTables;
 use Illuminate\Support\Facades\DB;
 use Maatwebsite\Excel\Facades\Excel;
 use Illuminate\Support\Facades\Log;
 
 class AksesController extends Controller
 {
     protected $akses;
 
     public function __construct(Akses $akses)
     {
         $this->akses = $akses;
     }
 
     public function index()
     {
         $y = Akses::all();
 
         return response()->json($y);
     }
 }
 