<?php

namespace App\Http\Controllers;

use App\Models\Akses;

class NyobaController extends Controller
{
    public function index()
    {
        $akses = Akses::all();
        return view('test', compact('akses'));
    }
}
