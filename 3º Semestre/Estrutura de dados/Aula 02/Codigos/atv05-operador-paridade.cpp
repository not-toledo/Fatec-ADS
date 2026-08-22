#include <iostream>
using namespace std;
int main()
{
	int numero;
	
	cout << "\n Digite um numero : ";
	cin >> numero;
	
	string paridade = (numero % 2 == 0) ? "par": "impar";
	
		cout << "O numero : " << numero << endl << "eh " << paridade << endl;
		
		return 0;
		
}
