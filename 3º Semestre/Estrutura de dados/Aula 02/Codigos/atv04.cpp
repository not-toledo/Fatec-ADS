#include <iostream>
using namespace std;

int main(){
    int salario;

    cout << "Digite seu salario\n";
    cin >> salario;

    if (salario <= 20000 )
    {
        cout << "Você é isento de imposto\n";
    } else if (salario <= 50000)
    {
        salario = salario * 0.10;
        cout << "Seu imposto foi: " << salario;
    } else {
        salario = salario * 0.20;
        cout << "Seu imposto foi: " << salario;
    }
    
    


}