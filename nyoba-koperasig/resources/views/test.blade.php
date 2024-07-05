<!DOCTYPE html>
<html>
<head>
    <title>Test View</title>
</head>
<body>
    <table border="1">
        <thead>
            <tr>
                <th>id</th>
                <th>label</th>
                <th>level akses</th>
            </tr>
        </thead>
        <tbody>
            @foreach($akses as $item)
            <tr>
                <td>{{ $item->id }}</td>
                <td>{{ $item->label }}</td>
                <td>{{ $item->level_akses }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
