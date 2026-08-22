#include <iostream>

using namespace std;
int main()
{
	int A, B, C;
		
	cout << "Insira o valor do lado A" << endl;
	cin >> A;
	cout << "Insira o valor do lado B" << endl;
	cin >> B;
	cout << "Insira o valor do lado C" << endl;
	cin >> C;

	cout << (A == B && B == C ? "\n Equilatero" : ( A != B && A != C && B != C ? "\n Escaleno" : "\n Isosceles" )) << endl;
	
	return 0;	
		
}