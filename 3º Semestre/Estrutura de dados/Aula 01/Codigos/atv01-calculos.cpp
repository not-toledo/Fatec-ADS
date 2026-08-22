#include <iostream>
using namespace std;
int main()
{

	double A, B, soma, subtracao, divisao, multi;
	
	cout << "Digite o valor de A:" << endl;
	cin >> A;
	cout << "Digite o valor de B:" << endl;
	cin >> B;
	
	soma = A + B;
	subtracao = A -B;
	multi = A * B;
	divisao = A/B;
	
	cout << "A soma deu um total de:" << soma << endl;
	cout << "A subtracao deu um total de:" << subtracao << endl;
	cout << "A multiplicacao deu um total de:" << multi << endl;
	cout << "A divisao deu um total de:" << divisao << endl;
	

}
