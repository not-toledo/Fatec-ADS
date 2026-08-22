#include <iostream>
using namespace std;
int main()
{

	double horatrab, valorhora, salbruto, salliquido, inss;
	
	cout << "\n insira a hora de trabalho: ";
	cin >> horatrab;
	cout << "\n insira o valor da hora: ";
	cin >> valorhora;
	
	salbruto = horatrab * valorhora;
	
	inss = salbruto * 0.12;
	
	salliquido = salbruto - inss;
	
	cout << "\n o valor do salário bruto é de: " << salbruto;
	
	cout << "\n o valor do salário liquido é de: " << salliquido;

return 0;

}
