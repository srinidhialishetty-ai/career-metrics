#include <stdio.h>

int main() {
    int p[20], f[10], time[10];
    int n, m, i, j, pos, min, found, faults = 0, count = 0;

    printf("Enter number of pages: ");
    scanf("%d", &n);

    printf("Enter page reference string: ");
    for(i = 0; i < n; i++)
        scanf("%d", &p[i]);

    printf("Enter number of frames: ");
    scanf("%d", &m);

    for(i = 0; i < m; i++)
        f[i] = -1;

    for(i = 0; i < n; i++) {
        found = 0;

        for(j = 0; j < m; j++) {
            if(f[j] == p[i]) {
                found = 1;
                time[j] = ++count;
            }
        }

        if(found == 0) {
            faults++;

            for(j = 0; j < m; j++) {
                if(f[j] == -1) {
                    f[j] = p[i];
                    time[j] = ++count;
                    found = 1;
                    break;
                }
            }

            if(found == 0) {
                min = time[0];
                pos = 0;

                for(j = 1; j < m; j++) {
                    if(time[j] < min) {
                        min = time[j];
                        pos = j;
                    }
                }

                f[pos] = p[i];
                time[pos] = ++count;
            }
        }

        printf("\n");
        for(j = 0; j < m; j++)
            printf("%d ", f[j]);
    }

    printf("\nPage Faults = %d", faults);

    return 0;
}