#include <stdio.h>

int main()
{
    int qtdlugares = 0;
    int qtdprioridade = 0;
    int vlrpassagem = 0;
    int vlrminimo = 0;

    int fileira = 4;
    int poltrona;

    int escolhaFileira;
    int escolhaPoltrona;

    printf("Quantidade total de lugares no onibus?\n");
    scanf("%d", &qtdlugares);

    printf("Quantidade de lugares reservados para pessoas com prioridade?\n");
    scanf("%d", &qtdprioridade);

    printf("Valor da passagem?\n");
    scanf("%d", &vlrpassagem);

    printf("Valor minimo de passagens para o onibus partir?\n");
    scanf("%d", &vlrminimo);

    poltrona = qtdlugares / fileira;

    int matriz[poltrona][fileira];

    
    for(int i = 0; i < poltrona; i++)
    {
        for(int j = 0; j < fileira; j++)
        {
            matriz[i][j] = 0;
        }
    }

    int continuar = 1;

    while(continuar == 1)
    {
        printf("\nQual fileira voce deseja comprar? ");
        scanf("%d", &escolhaFileira);

        printf("Qual poltrona voce deseja comprar? ");
        scanf("%d", &escolhaPoltrona);

        if(matriz[escolhaFileira - 1][escolhaPoltrona - 1] == 0)
        {
            matriz[escolhaFileira - 1][escolhaPoltrona - 1] = 8;

            printf("Passagem vendida!\n");
        }
        else
        {
            printf("Lugar ocupado! escolha outro lugar\n");
        }

        printf("\nVagas no onibus:\n");

        for(int i = 0; i < poltrona; i++)
        {
            for(int j = 0; j < fileira; j++)
            {
                printf("%d ", matriz[i][j]);
            }

            printf("\n");
        }

        printf("\nDeseja realizar outra venda? (1-Sim / 0-Nao): ");
        scanf("%d", &continuar);
    }

    return 0;
}