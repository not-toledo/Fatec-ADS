#include <iostream>
using namespace std;
int main()
{
	float valorlitro, distanciakm, consumo, totalitros, totalgasto;
	
	cout << "Digite o valor do litro:" << endl;
	cin >> valorlitro;
	
	cout << "Digite a distancia em Km:" << endl;
	cin >> distanciakm;
	
	cout << "Digite o consumo:" << endl;
	cin >> consumo;
	
	totalitros = distanciakm / consumo;
	totalgasto = totalitros * valorlitro;
	
	cout << "\n o total de litros consumidos foi de:" << totalitros;
	cout << "\n o valor gasto foi:" << totalgasto;

return 0;

}
