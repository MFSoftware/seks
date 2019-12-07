function fn(a, b) {
    console.log(a, b);
}

fn.apply(this, [ 1, 2 ]);