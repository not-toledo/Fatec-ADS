#include <stdio.h>
#include <string.h>

int main()
{
    char times[12][50], auxNome[50];
    int pontos[12], saldo[12];
    int i, j, aux;

    for (i = 0; i < 12; i++)
    {
        printf("Digite o nome do %d time: ", i + 1);
        scanf(" %49[^\n]", times[i]);

        printf("Digite os pontos ganhos: ");
        scanf("%d", &pontos[i]);

        printf("Digite o saldo de gols: ");
        scanf("%d", &saldo[i]);

        printf("\n");
    }

    printf("\n--- DADOS DOS TIMES ---\n");

    for (i = 0; i < 12; i++)
    {
        printf("%s - Pontos: %d - Saldo de gols: %d\n",
               times[i], pontos[i], saldo[i]);
    }

    for (i = 0; i < 11; i++)
    {
        for (j = i + 1; j < 12; j++)
        {
            if (pontos[i] < pontos[j] ||
               (pontos[i] == pontos[j] && saldo[i] < saldo[j]))
            {
                aux = pontos[i];
                pontos[i] = pontos[j];
                pontos[j] = aux;

                aux = saldo[i];
                saldo[i] = saldo[j];
                saldo[j] = aux;

                strcpy(auxNome, times[i]);
                strcpy(times[i], times[j]);
                strcpy(times[j], auxNome);
            }
        }
    }

    printf("\n--- CLASSIFICACAO FINAL ---\n");

    for (i = 0; i < 12; i++)
    {
        printf("%d lugar: %s - Pontos: %d - Saldo de gols: %d\n",
               i + 1, times[i], pontos[i], saldo[i]);
    }

    return 0;
}
