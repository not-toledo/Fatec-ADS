#include <iostream>
using namespace std;

int main(){
    int dia;
    cout << "Digite o numero do dia da semana (1 a 7): ";
    cin >> dia;


    if (dia >= 1 && dia <= 7 ) {
        if (dia == 1){
            cout << "Domingo" << endl;        
        } else if (dia == 2) {
            cout << "Segunda - feira" << endl;
        } else if (dia == 3) {
            cout << "Terça - feira" << endl;
        } else if (dia == 4) {
            cout << "Quarta - feira" << endl;
        } else if (dia == 5) {
            cout << "Quinta - feira" << endl;
        } else if (dia == 6) {
            cout << "Sexta - feira" << endl;
        } else if (dia == 7) {
            cout << "Sabado" << endl;
        }
} else {
    cout << "Esse numero nao e valido." << endl;
}

return 0;

}
    
