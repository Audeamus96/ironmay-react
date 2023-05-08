export const calcIronMen = (rd:number, bd:number): number => {
    const perc_runn = rd/42.2;
    const perc_cycl = bd/180.2;
    const min_irons = Math.floor(Math.min(perc_runn, perc_cycl));

    const val_run = perc_runn - min_irons;
    const val_cycl = perc_cycl - min_irons;

    const total_run = val_run >= 1 ? .5 : val_run * .5;
    const total_cycl = val_cycl >= 1 ? .5 : val_cycl * .5;

    const ironmen = total_run + total_cycl + min_irons;
    const ans = Math.ceil(ironmen * 100) / 100;
    return Math.round(ans * 100) / 100;
}