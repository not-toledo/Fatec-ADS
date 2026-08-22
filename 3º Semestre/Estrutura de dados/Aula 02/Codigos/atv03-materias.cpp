#include <iostream>
using namespace std;

int main(){
    int materia;

    cout << "Digite o numero da sua materia (1 - 9): ";
    cin >> materia;

    switch (materia) {
    case 1:
        cout << "Visao Computacional" << endl;
        break;
    case 2:
        cout << "Redes Neurais" << endl;
        break;
    case 3:
        cout << "Eng Software" << endl;
        break;
    case 4:
        cout << "Front-End" << endl;
        break;
    case 5:
        cout << "Back-End" << endl;
        break;
    case 6:
        cout << "Banco de Dados" << endl;
        break;
    case 7:
        cout << "Qualidade de Software" << endl;
        break;
    case 8:
        cout << "IA" << endl;
        break;
    case 9:
        cout << "Realidade Aumentada" << endl;
        break;
    default:
        cout << "Materia Invalida!!" << endl;
    }
    return 0;


}