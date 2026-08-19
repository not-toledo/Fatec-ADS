#include <iostream>
using namespace std;

int main(){
    int nota;

    cout << "digite sua nota";
    cin >> nota;

    if (nota >= 6)
    {
        cout << "PASSOU!!";
    } else {
        cout << "Reprovou";
    }
    
}