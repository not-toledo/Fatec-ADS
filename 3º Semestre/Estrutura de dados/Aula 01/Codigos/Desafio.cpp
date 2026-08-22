#include <iostream>
using namespace std;

int main(){

    int num;

    cout << "Digite um numero" << endl;
    cin >> num;

    if(num > 0){

        cout << "Numero eh positivo" << endl;
    } else if(num < 0){

        cout << "Numero eh negativo" << endl;
    } else {
        cout << "Numero eh zero" << endl;
    }

    return 0;
}