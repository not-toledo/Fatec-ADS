#include <iostream>
using namespace std;
int main()
{
	
int dia;
cout << "\n Digite o dia da semana (1 a 7): ";
cin >> dia;

if (dia >= 1 && dia <= 7) {
	if (dia == 1){
		cout << "\n Domingo" << endl;
	} else if (dia == 2) {
		cout << "\n Segunda-Feira" << endl;
	} else if (dia == 3) {
		cout << "\n Terça-Feira" << endl;
	} else if (dia == 4) {
		cout << "\n Quarta-Feira" << endl;
	} else if (dia == 5) {
		cout << "\n Quinta-Feira" << endl;
	} else if (dia == 6) {
		cout << "\n Sexta-Feira" << endl;
	} else if (dia == 7) {
		cout << "\n Sábado" << endl;
	}
	
} else {
	cout << "\n Esse número é inválido." << endl;
}	

return 0;

}

// endl *endline*
