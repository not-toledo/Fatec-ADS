#include <iostream>
using namespace std;
int main()
{

	double celsius, fahrenheit;
	
	cout << "\n informe a temperatura em fahrenheit:";
	cin >> fahrenheit;
	
	celsius = ((fahrenheit -32) * 5) / 9;
	
	cout << "\n a temperatura em celsius é de:" << celsius;
	
}
